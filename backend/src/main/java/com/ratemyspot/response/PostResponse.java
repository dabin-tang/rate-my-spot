package com.ratemyspot.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

@Data
@Accessors(chain = true)
@Schema(name = "PostResponse", description = "Post Response VO")
public class PostResponse {

    @Schema(description = "Post ID", example = "500")
    private Long id;

    @Schema(description = "Related Spot ID", example = "1001")
    private Long spotId;

    @Schema(description = "Author User ID", example = "2002")
    private Long userId;

    @Schema(description = "Post Title", example = "My weekend at Central Park")
    private String title;

    @Schema(description = "Main Content", example = "It was a sunny day...")
    private String content;

    @Schema(description = "Post Images", example = "url1.jpg,url2.jpg")
    private String images;

    @Schema(description = "User Rating for the Spot", example = "4")
    private Integer rating;

    @Schema(description = "Total Likes", example = "10")
    private Integer liked;

    @Schema(description = "Post Status (0:Active, 1:Review, 2:Hidden)", example = "0")
    private Integer status;

    @Schema(description = "Author Nickname", example = "Dabin")
    private String userNickname;

    @Schema(description = "Author Avatar URL", example = "https://example.com/icon.jpg")
    private String userIcon;

    @Schema(description = "Post Creation Time")
    private LocalDateTime createTime;

    @Schema(description = "Last Update Time")
    private LocalDateTime updateTime;

    @Schema(description = "Spot Name (For UI Card display)", example = "Starbucks Reserve")
    private String spotName;

    @Schema(description = "Category Name (For UI Tag display)", example = "Study & Grind")
    private String categoryName;

    @Schema(description = "Whether the current user has liked this post", example = "true")
    private Boolean isLiked = false;

    @Schema(description = "Whether the current user is following the author", example = "false")
    private Boolean isFollow = false;
}
