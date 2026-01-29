package com.ratemyspot.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
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
    @Column(name = "email", length = 128, nullable = false, unique = true)
    @Schema(description = "Email / Login Account", example = "dabin@example.com")
    private String email;

    /**
     * Encrypted Password
     */
    @Column(name = "password", length = 128, nullable = false)
    @Schema(description = "Encrypted Password", example = "bcrypt_hash_string")
    private String password;

    /**
     * User Nickname
     */
    @Column(name = "nickname", length = 32)
    @Schema(description = "Display Name", example = "Dabin")
    private String nickname;

    /**
     * Avatar URL
     */
    @Column(name = "icon", length = 255)
    @Schema(description = "Avatar URL", example = "https://example.com/icon.jpg")
    private String icon;

    /**
     * City Name
     */
    @Column(name = "city", length = 64)
    @Schema(description = "City", example = "New York")
    private String city;

    /**
     * Self Introduction
     */
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
     * Note: Handled manually in Service layer
     */
    @Column(name = "create_time", nullable = false)
    @Schema(description = "Registration Time")
    private LocalDateTime createTime;

    /**
     * Update Time
     * Note: Handled manually in Service layer
     */
    @Column(name = "update_time", nullable = false)
    @Schema(description = "Last Update Time")
    private LocalDateTime updateTime;
}