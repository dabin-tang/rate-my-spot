package com.ratemyspot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
@Schema(description = "Spot Review Creation Request")
public class SpotReviewCreateDTO implements Serializable {

    @Schema(description = "Spot ID", example = "1001")
    @NotNull(message = "Spot ID cannot be null")
    private Long spotId;

    @Schema(description = "Rating (1-5)", example = "5")
    @NotNull(message = "Rating cannot be null")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    @Schema(description = "Review Content", example = "Great place!")
    @Size(max = 1024, message = "Content must be less than 1024 characters")
    private String content;

    @Schema(description = "Image URLs", example = "[\"img1.jpg\", \"img2.jpg\"]")
    private List<String> images;
}
