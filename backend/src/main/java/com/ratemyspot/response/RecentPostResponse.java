package com.ratemyspot.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@Schema(description = "Recent Post Response View Object")
public class RecentPostResponse {

    @Schema(description = "Post ID", example = "1")
    private Long id;

    @Schema(description = "Associated Spot ID", example = "100")
    private Long spotId;

    @Schema(description = "User ID who created the post", example = "1001")
    private Long userId;

    @Schema(description = "User Nickname", example = "Dabin")
    private String userNickname;

    @Schema(description = "User Icon URL", example = "https://example.com/icon.png")
    private String userIcon;

    @Schema(description = "Post Title", example = "Great Spot!")
    private String title;

    @Schema(description = "Post Content", example = "I really loved this place...")
    private String content;

    @Schema(description = "List of image URLs")
    private List<String> images;

    @Schema(description = "Post Status (0: Active)", example = "0")
    private Integer status;

    @Schema(description = "Creation Time", example = "2026-10-01 12:00:00")
    private LocalDateTime createTime;

    @Schema(description = "Update Time", example = "2026-10-01 12:00:00")
    private LocalDateTime updateTime;

    /**
     * Constructor for JPQL projection
     */
    public RecentPostResponse(Long id, Long spotId, Long userId, String userNickname, String userIcon,
                              String title, String content, String images, Integer status,
                              LocalDateTime createTime, LocalDateTime updateTime) {
        this.id = id;
        this.spotId = spotId;
        this.userId = userId;
        this.userNickname = userNickname;
        this.userIcon = userIcon;
        this.title = title;
        this.content = content;
        // Convert comma-separated string to List
        if (images != null && !images.isEmpty()) {
            this.images = Arrays.asList(images.split(","));
        } else {
            this.images = new ArrayList<>();
        }
        this.status = status;
        this.createTime = createTime;
        this.updateTime = updateTime;
    }
}
