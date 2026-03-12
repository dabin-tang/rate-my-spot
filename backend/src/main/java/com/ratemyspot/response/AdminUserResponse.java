package com.ratemyspot.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@Schema(name = "AdminUserResponse", description = "User info returned to admin panel")
public class AdminUserResponse {

    @Schema(description = "User ID", example = "1001")
    private Long id;

    @Schema(description = "Email", example = "dabin@example.com")
    private String email;

    @Schema(description = "Display Name", example = "Dabin")
    private String nickname;

    @Schema(description = "Avatar URL", example = "https://example.com/icon.jpg")
    private String icon;

    @Schema(description = "City", example = "New York")
    private String city;

    @Schema(description = "Credit Points", example = "100")
    private Integer credit;

    @Schema(description = "Account Status (0:Active, 1:Banned)", example = "0")
    private Integer status;

    @Schema(description = "Registration Time")
    private LocalDateTime createTime;
}
