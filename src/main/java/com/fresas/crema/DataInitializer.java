package com.fresas.crema;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.fresas.crema.enums.Role;
import com.fresas.crema.modelos.*;
import com.fresas.crema.repositorios.*;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepositorio usuarioRepository;

    @Autowired
    private ConfiguracionRepositorio configuracionRepository;

    @Autowired
    private ProductoRepositorio productoRepositorio;

    @Autowired
    private TamanioRepositorio tamanioRepositorio;

    @Autowired
    private ToppingRepositorio toppingRepositorio;

    @Autowired
    private JaleaRepositorio jaleaRepositorio;

    @Autowired
    private AdicionalRepositorio adicionalRepositorio;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // 1. Crear o verificar usuario admin
        Usuario adminUser = usuarioRepository.findByUsername("admin");
        if (adminUser == null) {
            // Crear nuevo usuario admin
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            usuarioRepository.save(admin);
            System.out.println("✓ Usuario admin creado con rol: " + Role.ADMIN.getDisplayName());
        } else {
            // Verificar que el admin tenga el rol correcto
            if (adminUser.getRole() != Role.ADMIN) {
                adminUser.setRole(Role.ADMIN);
                usuarioRepository.save(adminUser);
                System.out.println("✓ Rol de admin actualizado a: " + Role.ADMIN.getDisplayName());
            }
        }

        // 2. Verificar si ya hay datos en la base de datos
        if (productoRepositorio.count() > 0) {
            System.out.println("✓ La base de datos ya tiene datos. Saltando inicialización...");
            return;
        }

        System.out.println("🔄 Iniciando población de la base de datos...");

        // 3. Crear configuración de WhatsApp
        Configuracion config = new Configuracion();
        config.setClave("WHATSAPP_NUMERO");
        config.setValor("+51999888777");
        configuracionRepository.save(config);
        System.out.println("✓ Configuración de WhatsApp creada");

        // 4. Crear Toppings
        Topping topping1 = new Topping("Oreo", true);
        Topping topping2 = new Topping("Chin Chin", true);
        Topping topping3 = new Topping("Gomitas", true);
        Topping topping4 = new Topping("Lentejas", true);
        Topping topping5 = new Topping("Maní", true);

        toppingRepositorio.save(topping1);
        toppingRepositorio.save(topping2);
        toppingRepositorio.save(topping3);
        toppingRepositorio.save(topping4);
        toppingRepositorio.save(topping5);
        System.out.println("✓ 5 Toppings creados");

        // 5. Crear Jaleas
        Jalea jalea1 = new Jalea("Fudge de Chocolate", true);
        Jalea jalea2 = new Jalea("Manjar Blanco", true);
        Jalea jalea3 = new Jalea("Leche Condensada", true);

        jaleaRepositorio.save(jalea1);
        jaleaRepositorio.save(jalea2);
        jaleaRepositorio.save(jalea3);
        System.out.println("✓ 3 Jaleas creadas");

        // 6. Crear Adicionales
        Adicional adicional1 = new Adicional("Extra Topping", 2.0, true);
        Adicional adicional2 = new Adicional("Extra Jalea", 1.5, true);
        Adicional adicional3 = new Adicional("Nutella", 3.0, true);

        adicionalRepositorio.save(adicional1);
        adicionalRepositorio.save(adicional2);
        adicionalRepositorio.save(adicional3);
        System.out.println("✓ 3 Adicionales creados");

        // 7. Crear Productos
        // Producto 1: DeliClásica
        Producto producto1 = new Producto();
        producto1.setNombre("DeliClásica");
        producto1.setDescripcion("Las tradicionales fresas frescas con nuestra crema secreta de la casa.");
        producto1.setFotoUrl("https://via.placeholder.com/400x300.png?text=DeliClasica");
        producto1.setTipoCrema("NORMAL");
        productoRepositorio.save(producto1);

        // Producto 2: ChocoBoon
        Producto producto2 = new Producto();
        producto2.setNombre("ChocoBoon");
        producto2.setDescripcion("Una base de brownie, fresas y nuestra deliciosa crema.");
        producto2.setFotoUrl("https://via.placeholder.com/400x300.png?text=ChocoBoon");
        producto2.setTipoCrema("CAFE");
        productoRepositorio.save(producto2);

        System.out.println("✓ 2 Productos creados");

        // 8. Crear Tamaños para DeliClásica
        Tamanio tamanio1 = new Tamanio();
        tamanio1.setNombre("Personal");
        tamanio1.setPrecioBase(10.0);
        tamanio1.setToppingsIncluidos(1);
        tamanio1.setJaleasIncluidas(1);
        tamanio1.setProducto(producto1);
        tamanioRepositorio.save(tamanio1);

        Tamanio tamanio2 = new Tamanio();
        tamanio2.setNombre("Mediano");
        tamanio2.setPrecioBase(15.0);
        tamanio2.setToppingsIncluidos(2);
        tamanio2.setJaleasIncluidas(1);
        tamanio2.setProducto(producto1);
        tamanioRepositorio.save(tamanio2);

        // 9. Crear Tamaños para ChocoBoon
        Tamanio tamanio3 = new Tamanio();
        tamanio3.setNombre("Personal");
        tamanio3.setPrecioBase(14.0);
        tamanio3.setToppingsIncluidos(2);
        tamanio3.setJaleasIncluidas(1);
        tamanio3.setProducto(producto2);
        tamanioRepositorio.save(tamanio3);

        Tamanio tamanio4 = new Tamanio();
        tamanio4.setNombre("Mediano");
        tamanio4.setPrecioBase(20.0);
        tamanio4.setToppingsIncluidos(3);
        tamanio4.setJaleasIncluidas(2);
        tamanio4.setProducto(producto2);
        tamanioRepositorio.save(tamanio4);

        System.out.println("✓ 4 Tamaños creados");

        System.out.println("✅ Base de datos poblada exitosamente!");
        System.out.println("📋 Resumen:");
        System.out.println("   - Productos: " + productoRepositorio.count());
        System.out.println("   - Tamaños: " + tamanioRepositorio.count());
        System.out.println("   - Toppings: " + toppingRepositorio.count());
        System.out.println("   - Jaleas: " + jaleaRepositorio.count());
        System.out.println("   - Adicionales: " + adicionalRepositorio.count());
        System.out.println("   - Usuarios: " + usuarioRepository.count());
        System.out.println("\n🔐 Credenciales Admin: username=admin, password=admin123");
        System.out.println("📱 WhatsApp configurado: +51999888777");
    }
}
