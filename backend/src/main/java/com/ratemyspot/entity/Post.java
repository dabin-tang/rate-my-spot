package com.ratemyspot.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "post")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(name = "Post", description = "Social Post Entity (Heavyweight)")
public class Post implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Primary Key
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Post ID", example = "500")
    private Long id;

    /**
     * Spot ID (Foreign Key)
     */
    @NotNull(message = "Spot ID cannot be null")
    @Column(name = "spot_id", nullable = false)
    @Schema(description = "Related Spot ID", example = "1001")
    private Long spotId;

    /**
     * User ID (Foreign Key)
     */
    @NotNull(message = "User ID cannot be null")
    @Column(name = "user_id", nullable = false)
    @Schema(description = "Author User ID", example = "2002")
    private Long userId;

    /**
     * Post Title
     */
    @NotBlank(message = "Title cannot be empty")
    @Size(max = 255, message = "Title must be less than 255 characters")
    @Column(name = "title", length = 255, nullable = false)
    @Schema(description = "Post Title", example = "My weekend at Central Park")
    private String title;

    /**
     * Post Content
     */
    @NotBlank(message = "Content cannot be empty")
    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    @Schema(description = "Main Content", example = "It was a sunny day...")
    private String content;

    /**
     * Post Images (Comma separated URLs)
     */
    @NotNull(message = "Images cannot be null")
    @Size(max = 2048, message = "Image URLs must be less than 2048 characters")
    @Column(name = "images", length = 2048, nullable = false)
    @Schema(description = "Post Images", example = "url1.jpg,url2.jpg")
    private String images;

    /**
     * Rating (1-5 stars)
     */
    @NotNull(message = "Rating cannot be null")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    @Column(name = "rating", nullable = false)
    @Schema(description = "User Rating for the Spot", example = "4")
    private Integer rating;

    /**
     * Like Count
     */
    @Column(name = "liked")
    @Schema(description = "Total Likes", example = "10")
    private Integer liked;

    /**
     * Status: 0-Active, 1-Review, 2-Hidden
     */
    @Column(name = "status")
    @Schema(description = "Post Status (0:Active, 1:Review, 2:Hidden)", example = "0")
    private Integer status;

    /**
     * Author Nickname (Redundant)
     */
    @Size(max = 32, message = "Nickname must be less than 32 characters")
    @Column(name = "user_nickname", length = 32)
    @Schema(description = "Author Nickname (Redundant)", example = "Dabin")
    private String userNickname;

    /**
     * Author Avatar URL (Redundant)
     */
    @Size(max = 255, message = "Avatar URL must be less than 255 characters")
    @Column(name = "user_icon", length = 255)
    @Schema(description = "Author Avatar URL (Redundant)", example = "https://example.com/icon.jpg")
    private String userIcon;

    /**
     * Creation Time
     */
    @Column(name = "create_time", nullable = false)
    @Schema(description = "Post Creation Time")
    private LocalDateTime createTime;

    /**
     * Last Update Time
     */
    @Column(name = "update_time", nullable = false)
    @Schema(description = "Last Update Time")
    private LocalDateTime updateTime;
}