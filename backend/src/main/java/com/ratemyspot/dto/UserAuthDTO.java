package com.ratemyspot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(name = "UserLoginDTO", description = "Login Request Parameter")
public class UserAuthDTO {

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
    @Schema(description = "User Email", example = "student@college.edu")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Schema(description = "User Password", example = "123456")
    private String password;
}