package com.ratemyspot.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(name = "User", description = "User Entity")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Primary Key ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "User ID", example = "1001")
    private Long id;

    /**
     * User Email (Login Account)
     */
    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
    @Size(max = 128, message = "Email must be less than 128 characters")
    @Column(name = "email", length = 128, nullable = false, unique = true)
    @Schema(description = "Email / Login Account", example = "dabin@example.com")
    private String email;

    /**
     * Encrypted Password
     */
    @NotBlank(message = "Password cannot be empty")
    @Size(max = 128, message = "Password must be less than 128 characters")
    @Column(name = "password", length = 128, nullable = false)
    @Schema(description = "Encrypted Password", example = "bcrypt_hash_string")
    private String password;

    /**
     * User Nickname
     */
    @Size(max = 32, message = "Nickname must be less than 32 characters")
    @Column(name = "nickname", length = 32)
    @Schema(description = "Display Name", example = "Dabin")
    private String nickname;

    /**
     * Avatar URL
     */
    @Size(max = 255, message = "Avatar URL must be less than 255 characters")
    @Column(name = "icon", length = 255)
    @Schema(description = "Avatar URL", example = "https://example.com/icon.jpg")
    private String icon;

    /**
     * City Name
     */
    @Size(max = 64, message = "City name must be less than 64 characters")
    @Column(name = "city", length = 64)
    @Schema(description = "City", example = "New York")
    private String city;

    /**
     * Self Introduction
     */
    @Size(max = 128, message = "Intro must be less than 128 characters")
    @Column(name = "intro", length = 128)
    @Schema(description = "Self Introduction", example = "CS Student @ QC")
    private String intro;

    /**
     * Gender: 0-Unknown, 1-Male, 2-Female
     */
    @Column(name = "gender")
    @Schema(description = "Gender (0:Unknown, 1:Male, 2:Female)", example = "1")
    private Integer gender;

    /**
     * User Credit / Points
     */
    @Column(name = "credit")
    @Schema(description = "User Credit Points", example = "100")
    private Integer credit;

    /**
     * Account Status: 0-Active, 1-Banned
     */
    @Column(name = "status")
    @Schema(description = "Account Status (0:Active, 1:Banned)", example = "0")
    private Integer status;

    /**
     * Creation Time
     */
    @Column(name = "create_time", nullable = false)
    @Schema(description = "Registration Time")
    private LocalDateTime createTime;

    /**
     * Update Time
     */
    @Column(name = "update_time", nullable = false)
    @Schema(description = "Last Update Time")
    private LocalDateTime updateTime;
}