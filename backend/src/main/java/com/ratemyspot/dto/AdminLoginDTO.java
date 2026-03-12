package com.ratemyspot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Schema(name = "AdminLoginDTO", description = "Admin Login Request")
public class AdminLoginDTO {

    @NotBlank(message = "Username cannot be empty")
    @Schema(description = "Admin username", example = "admin")
    private String username;

    @NotBlank(message = "Password cannot be empty")
    @Schema(description = "Admin password", example = "P@ssw0rd")
    private String password;
}
