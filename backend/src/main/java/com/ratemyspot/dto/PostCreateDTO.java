package com.ratemyspot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(name = "PostCreateDTO", description = "Post Creation Request DTO")
public class PostCreateDTO {

    @NotNull(message = "Spot ID cannot be null")
    @Schema(description = "Related Spot ID", example = "1001")
    private Long spotId;

    @NotBlank(message = "Title cannot be empty")
    @Size(max = 255, message = "Title must be less than 255 characters")
    @Schema(description = "Post Title", example = "My weekend at Central Park")
    private String title;

    @NotBlank(message = "Content cannot be empty")
    @Schema(description = "Main Content", example = "It was a sunny day...")
    private String content;

    @NotNull(message = "Images cannot be null")
    @Size(max = 2048, message = "Image URLs must be less than 2048 characters")
    @Schema(description = "Post Images (Comma separated URLs)", example = "url1.jpg,url2.jpg")
    private String images;

    @NotNull(message = "Rating cannot be null")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    @Schema(description = "User Rating for the Spot (1-5)", example = "4")
    private Integer rating;
}
