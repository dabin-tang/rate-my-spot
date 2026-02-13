package com.ratemyspot.response;

import com.fasterxml.jackson.annotation.JsonFormat;
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
@Schema(description = "Spot Review Response View Object")
public class SpotReviewResponse {

    @Schema(description = "Review ID", example = "100")
    private Long id;

    @Schema(description = "User ID", example = "200")
    private Long userId;

    @Schema(description = "User Nickname", example = "John Doe")
    private String userNickname;

    @Schema(description = "User Icon URL", example = "https://example.com/avatar.jpg")
    private String userIcon;

    @Schema(description = "Rating (1-5)", example = "5")
    private Integer rating;

    @Schema(description = "Review Content", example = "Great place!")
    private String content;

    @Schema(description = "Review Images")
    private List<String> images;

    @Schema(description = "Create Time", example = "2023-10-01 12:00:00")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    /**
     * Constructor for JPQL Projection.
     * Note: imageStr comes from DB as comma-separated string.
     */
    public SpotReviewResponse(Long id, Long userId, String userNickname, String userIcon,
                              Integer rating, String content, String imageStr, LocalDateTime createTime) {
        this.id = id;
        this.userId = userId;
        this.userNickname = userNickname;
        this.userIcon = userIcon;
        this.rating = rating;
        this.content = content;
        this.createTime = createTime;

        if (imageStr != null && !imageStr.isEmpty()) {
            this.images = Arrays.asList(imageStr.split(","));
        } else {
            this.images = new ArrayList<>();
        }
    }
}
