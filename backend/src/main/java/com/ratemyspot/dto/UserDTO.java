package com.ratemyspot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(name = "UserDTO", description = "Basic User Information DTO")
public class UserDTO {
    
    @Schema(description = "User ID", example = "1001")
    private Long id;

    @Schema(description = "User Email", example = "student@college.edu")
    private String email;

    @Schema(description = "User Nickname", example = "Dabin")
    private String nickname;

    @Schema(description = "User Icon/Avatar URL", example = "https://example.com/avatar.jpg")
    private String icon;
}