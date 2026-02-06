package com.ratemyspot.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "SpotResponse", description = "Spot Response VO")
public class SpotResponse {

    @Schema(description = "Spot ID", example = "1001")
    private Long id;

    @Schema(description = "Spot Name", example = "Central Park")
    private String name;

    @Schema(description = "Category ID", example = "1")
    private Long categoryId;

    @Schema(description = "Spot Description", example = "A large public park in NYC.")
    private String description;

    @Schema(description = "Address", example = "New York, NY")
    private String address;

    @Schema(description = "Spot Images (Comma separated)", example = "url1.jpg,url2.jpg")
    private String images;

    @Schema(description = "Longitude", example = "-73.9665")
    private Double x;

    @Schema(description = "Latitude", example = "40.7812")
    private Double y;

    @Schema(description = "Average Rating Score", example = "4.5")
    private Double score;

    @Schema(description = "Total Number of Reviews", example = "150")
    private Integer reviewCount;

    @Schema(description = "Creation Time")
    private LocalDateTime createTime;

    @Schema(description = "Last Update Time")
    private LocalDateTime updateTime;
}
