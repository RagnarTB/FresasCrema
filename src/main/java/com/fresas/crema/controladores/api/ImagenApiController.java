package com.fresas.crema.controladores.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@RestController
@RequestMapping("/api/admin/imagenes")
public class ImagenApiController {

    @Value("${app.upload.dir:${user.home}/uploads/productos}")
    private String uploadDir;

    /**
     * Subir una nueva imagen
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> subirImagen(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Validar que el archivo no esté vacío
            if (file.isEmpty()) {
                response.put("error", "El archivo está vacío");
                return ResponseEntity.badRequest().body(response);
            }

            // Validar tipo de archivo (solo imágenes)
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                response.put("error", "Solo se permiten archivos de imagen (JPG, PNG, GIF, WebP)");
                return ResponseEntity.badRequest().body(response);
            }

            // Validar tamaño del archivo (máximo 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                response.put("error", "El archivo es demasiado grande. Tamaño máximo: 5MB");
                return ResponseEntity.badRequest().body(response);
            }

            // Crear directorio si no existe
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generar nombre único para el archivo
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(filename);

            // Guardar el archivo
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Devolver la URL de la imagen
            String imageUrl = "/uploads/productos/" + filename;
            response.put("success", true);
            response.put("url", imageUrl);
            response.put("filename", filename);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            response.put("error", "Error al guardar la imagen: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Listar todas las imágenes
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> listarImagenes() {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, String>> imagenes = new ArrayList<>();

        try {
            Path uploadPath = Paths.get(uploadDir);
            if (Files.exists(uploadPath)) {
                Files.list(uploadPath)
                        .filter(Files::isRegularFile)
                        .filter(path -> {
                            String fileName = path.getFileName().toString().toLowerCase();
                            return fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") ||
                                    fileName.endsWith(".png") || fileName.endsWith(".gif") ||
                                    fileName.endsWith(".webp");
                        })
                        .forEach(path -> {
                            Map<String, String> imagen = new HashMap<>();
                            String filename = path.getFileName().toString();
                            imagen.put("filename", filename);
                            imagen.put("url", "/uploads/productos/" + filename);
                            imagenes.add(imagen);
                        });
            }

            response.put("success", true);
            response.put("imagenes", imagenes);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            response.put("error", "Error al listar las imágenes: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Eliminar una imagen
     */
    @DeleteMapping("/{filename}")
    public ResponseEntity<Map<String, Object>> eliminarImagen(@PathVariable String filename) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Validar el nombre del archivo para evitar path traversal
            if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
                response.put("error", "Nombre de archivo inválido");
                return ResponseEntity.badRequest().body(response);
            }

            Path filePath = Paths.get(uploadDir).resolve(filename);
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                response.put("success", true);
                response.put("message", "Imagen eliminada exitosamente");
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "La imagen no existe");
                return ResponseEntity.notFound().build();
            }

        } catch (IOException e) {
            response.put("error", "Error al eliminar la imagen: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Servir una imagen (opcional, si no se configura en recursos estáticos)
     */
    @GetMapping("/{filename}")
    public ResponseEntity<Resource> obtenerImagen(@PathVariable String filename) {
        try {
            // Validar el nombre del archivo
            if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
                return ResponseEntity.badRequest().build();
            }

            Path filePath = Paths.get(uploadDir).resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                // Determinar el tipo de contenido
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
