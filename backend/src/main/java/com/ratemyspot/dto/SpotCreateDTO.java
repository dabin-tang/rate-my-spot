package com.ratemyspot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Schema(name = "SpotCreateDTO", description = "Request body for creating a new spot")
public class SpotCreateDTO {

    @NotBlank(message = "Spot name cannot be empty")
    @Schema(description = "Spot Name", example = "Central Park")
    private String name;

    @NotNull(message = "Category ID cannot be null")
    @Schema(description = "Category ID", example = "1")
    private Long categoryId;

    @Schema(description = "Spot Description", example = "A large public park in NYC.")
    private String description;

    @NotBlank(message = "Address cannot be empty")
    @Schema(description = "Address", example = "New York, NY")
    private String address;

    @Schema(description = "Spot Images (Comma separated URLs)", example = "url1.jpg,url2.jpg")
    private String images;

    @NotNull(message = "Longitude cannot be null")
    @Schema(description = "Longitude", example = "-73.9665")
    private Double x;

    @NotNull(message = "Latitude cannot be null")
    @Schema(description = "Latitude", example = "40.7812")
    private Double y;
}
