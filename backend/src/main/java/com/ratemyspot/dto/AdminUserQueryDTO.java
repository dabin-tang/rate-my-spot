package com.ratemyspot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Schema(name = "AdminUserQueryDTO", description = "Query parameters for admin user list")
public class AdminUserQueryDTO {

    @Schema(description = "Nickname keyword for fuzzy search", example = "Dabin")
    private String nickname;

    @Schema(description = "Email keyword for fuzzy search", example = "dabin@")
    private String email;

    @Schema(description = "Page number, starts from 1", example = "1", defaultValue = "1")
    private Integer page = 1;

    @Schema(description = "Page size", example = "10", defaultValue = "10")
    private Integer size = 10;
}
