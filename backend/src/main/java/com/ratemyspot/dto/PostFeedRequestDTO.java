package com.ratemyspot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
@Schema(name = "PostFeedRequestDTO", description = "Post Feed Query Parameters")
public class PostFeedRequestDTO {

    @Schema(description = "Filter by Spot Category ID. If null, returns all categories (Recommendation mode).", example = "2")
    private Long categoryId;

    @Schema(description = "Sort order: 'default' (random/algorithm) or 'latest' (by creation time). Default is 'default'.", example = "latest")
    private String sort = "default";

    @Min(value = 1, message = "Page number must be at least 1")
    @Schema(description = "Page number for pagination (Default: 1)", example = "1")
    private Integer page = 1;

    @Min(value = 1, message = "Page size must be at least 1")
    @Schema(description = "Number of items per page (Default: 20)", example = "20")
    private Integer size = 20;
}