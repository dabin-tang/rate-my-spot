package com.ratemyspot.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(name = "Admin", description = "Administrator Account Entity")
public class Admin implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Primary Key
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Admin ID", example = "1")
    private Long id;

    /**
     * Login Username
     */
    @NotBlank(message = "Username cannot be empty")
    @Size(max = 32, message = "Username must be less than 32 characters")
    @Column(name = "username", length = 32, nullable = false, unique = true)
    @Schema(description = "Login Username", example = "admin")
    private String username;

    /**
     * Encrypted Password
     */
    @NotBlank(message = "Password cannot be empty")
    @Size(max = 128, message = "Password must be less than 128 characters")
    @Column(name = "password", length = 128, nullable = false)
    @Schema(description = "Encrypted Password", example = "hashed_password_123")
    private String password;

    /**
     * Role Permissions (e.g., admin, super_admin)
     */
    @Size(max = 32, message = "Role must be less than 32 characters")
    @Column(name = "role", length = 32)
    @Schema(description = "Admin Role", example = "super_admin")
    private String role;

    /**
     * Creation Time
     */
    @Column(name = "create_time", nullable = false)
    @Schema(description = "Account Creation Time")
    private LocalDateTime createTime;
}