package com.fresas.crema.enums;

/**
 * Enum que define los roles de usuario en el sistema
 */
public enum Role {
    /**
     * Rol de administrador con acceso completo al sistema
     */
    ADMIN("ROLE_ADMIN", "Administrador"),

    /**
     * Rol de usuario normal (para futuras expansiones)
     */
    USER("ROLE_USER", "Usuario");

    private final String authority;
    private final String displayName;

    Role(String authority, String displayName) {
        this.authority = authority;
        this.displayName = displayName;
    }

    /**
     * Obtiene el nombre de la autoridad de Spring Security
     * @return El nombre de la autoridad (ej: "ROLE_ADMIN")
     */
    public String getAuthority() {
        return authority;
    }

    /**
     * Obtiene el nombre para mostrar del rol
     * @return El nombre legible del rol (ej: "Administrador")
     */
    public String getDisplayName() {
        return displayName;
    }

    /**
     * Obtiene el rol sin el prefijo ROLE_
     * @return El nombre del rol sin prefijo (ej: "ADMIN")
     */
    public String getRoleName() {
        return this.name();
    }

    /**
     * Obtiene un Role desde su authority
     * @param authority El authority (ej: "ROLE_ADMIN")
     * @return El Role correspondiente
     */
    public static Role fromAuthority(String authority) {
        for (Role role : values()) {
            if (role.authority.equals(authority)) {
                return role;
            }
        }
        throw new IllegalArgumentException("No role found for authority: " + authority);
    }

    @Override
    public String toString() {
        return authority;
    }
}
