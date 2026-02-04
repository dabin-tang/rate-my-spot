package com.ratemyspot.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "spot")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(name = "Spot", description = "Spot / Location Entity")
public class Spot implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Primary Key
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Spot ID", example = "1001")
    private Long id;

    /**
     * Spot Name
     */
    @NotBlank(message = "Spot name cannot be empty")
    @Size(max = 128, message = "Spot name must be less than 128 characters")
    @Column(name = "name", length = 128, nullable = false)
    @Schema(description = "Spot Name", example = "Central Park")
    private String name;

    /**
     * Category ID (Foreign Key)
     */
    @NotNull(message = "Category ID cannot be null")
    @Column(name = "category_id", nullable = false)
    @Schema(description = "Category ID", example = "1")
    private Long categoryId;

    /**
     * Detailed Description
     */
    @Column(name = "description", columnDefinition = "TEXT")
    @Schema(description = "Spot Description", example = "A large public park in NYC.")
    private String description;

    /**
     * Physical Address
     */
    @NotBlank(message = "Address cannot be empty")
    @Size(max = 255, message = "Address must be less than 255 characters")
    @Column(name = "address", length = 255, nullable = false)
    @Schema(description = "Address", example = "New York, NY")
    private String address;

    /**
     * Images (Comma separated URLs)
     */
    @Size(max = 1024, message = "Image URLs must be less than 1024 characters")
    @Column(name = "images", length = 1024)
    @Schema(description = "Spot Images (Comma separated)", example = "url1.jpg,url2.jpg")
    private String images;

    /**
     * Longitude (X)
     */
    @NotNull(message = "Longitude cannot be null")
    @Column(name = "x", nullable = false)
    @Schema(description = "Longitude", example = "-73.9665")
    private Double x;

    /**
     * Latitude (Y)
     */
    @NotNull(message = "Latitude cannot be null")
    @Column(name = "y", nullable = false)
    @Schema(description = "Latitude", example = "40.7812")
    private Double y;

    /**
     * Aggregate Score (0.0 - 5.0)
     */
    @Column(name = "score")
    @Schema(description = "Average Rating Score", example = "4.5")
    private Double score;

    /**
     * Total Review Count
     */
    @Column(name = "review_count")
    @Schema(description = "Total Number of Reviews", example = "150")
    private Integer reviewCount;

    /**
     * Creation Time
     */
    @Column(name = "create_time", nullable = false)
    @Schema(description = "Creation Time")
    private LocalDateTime createTime;

    /**
     * Last Update Time
     */
    @Column(name = "update_time", nullable = false)
    @Schema(description = "Last Update Time")
    private LocalDateTime updateTime;
}