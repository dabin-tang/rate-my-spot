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
@Schema(name = "SpotCategoryResponse", description = "Spot Category Response VO")
public class SpotCategoryResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "Category ID", example = "1")
    private Long id;

    @Schema(description = "Category Name", example = "Park")
    private String name;

    @Schema(description = "Category Icon URL", example = "https://example.com/icons/park.png")
    private String icon;

    @Schema(description = "Sort Order", example = "10")
    private Integer sort;
}
