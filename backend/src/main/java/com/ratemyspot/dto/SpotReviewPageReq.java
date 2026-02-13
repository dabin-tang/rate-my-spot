package com.ratemyspot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "Spot Review Pagination Request")
public class SpotReviewPageReq {

    @Schema(description = "Spot ID", example = "100", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Spot ID cannot be null")
    private Long spotId;

    @Schema(description = "Page number (default 1)", example = "1")
    @Min(value = 1, message = "Page must be greater than 0")
    private int page = 1;

    @Schema(description = "Page size (default 10)", example = "10")
    @Min(value = 1, message = "Size must be greater than 0")
    private int size = 10;
}
