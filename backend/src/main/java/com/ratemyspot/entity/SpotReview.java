package com.ratemyspot.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "spot_review")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(name = "SpotReview", description = "Spot Review Entity (Lightweight)")
public class SpotReview implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Primary Key
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Review ID", example = "100")
    private Long id;

    /**
     * Spot ID (Foreign Key)
     */
    @Column(name = "spot_id", nullable = false)
    @Schema(description = "Target Spot ID", example = "1001")
    private Long spotId;

    /**
     * User ID (Foreign Key)
     */
    @Column(name = "user_id", nullable = false)
    @Schema(description = "Author User ID", example = "2002")
    private Long userId;

    /**
     * Rating (1-5 stars)
     */
    @Column(name = "rating", nullable = false)
    @Schema(description = "Rating Score (1-5)", example = "5")
    private Integer rating;

    /**
     * Review Content
     */
    @Column(name = "content", length = 1024)
    @Schema(description = "Review Text Content", example = "Great place!")
    private String content;

    /**
     * Review Images (Comma separated URLs)
     */
    @Column(name = "images", length = 2048)
    @Schema(description = "Review Images", example = "img1.jpg,img2.jpg")
    private String images;

    /**
     * Creation Time
     */
    @Column(name = "create_time", nullable = false)
    @Schema(description = "Review Time")
    private LocalDateTime createTime;
}