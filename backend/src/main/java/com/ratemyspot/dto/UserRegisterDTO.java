package com.ratemyspot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(name = "UserRegisterDTO", description = "User Registration Request")
public class UserRegisterDTO {

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
    @Schema(description = "User Email", example = "student@college.edu")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Schema(description = "User Password", example = "123456")
    private String password;

    @NotBlank(message = "Verification code cannot be empty")
    @Schema(description = "Email Verification Code", example = "1234")
    private String code;
}