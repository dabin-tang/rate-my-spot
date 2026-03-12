package com.ratemyspot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Schema(name = "SpotCategoryUpdateDTO", description = "Request body for updating a spot category")
public class SpotCategoryUpdateDTO {

    @Schema(description = "Category Name", example = "Park")
    private String name;

    @Schema(description = "Category Icon URL", example = "https://example.com/icons/park.png")
    private String icon;

    @Schema(description = "Sort Order (lower = higher priority)", example = "10")
    private Integer sort;
}
