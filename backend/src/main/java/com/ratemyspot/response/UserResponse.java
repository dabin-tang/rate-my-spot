package com.ratemyspot.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@Schema(name = "UserResponse", description = "User summary info returned to frontend")
public class UserResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "User ID", example = "1001")
    private Long id;

    @Schema(description = "Display Name", example = "Dabin")
    private String nickname;

    @Schema(description = "Avatar URL", example = "https://example.com/icon.jpg")
    private String icon;

    @Schema(description = "City", example = "New York")
    private String city;

    @Schema(description = "Self Introduction", example = "CS Student @ QC")
    private String intro;
}
