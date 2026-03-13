package com.ratemyspot.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@Schema(name = "AdminCommentResponse", description = "Comment info returned to admin panel")
public class AdminCommentResponse {

    @Schema(description = "Comment ID", example = "100")
    private Long id;

    @Schema(description = "Post ID", example = "500")
    private Long postId;

    @Schema(description = "Commenter User ID", example = "2002")
    private Long userId;

    @Schema(description = "Parent Comment ID (0 if root)", example = "0")
    private Long parentId;

    @Schema(description = "Comment Content", example = "Looks great!")
    private String content;

    @Schema(description = "Comment Image URL", example = "img.jpg")
    private String image;

    @Schema(description = "Like Count", example = "5")
    private Integer liked;

    @Schema(description = "Comment Time")
    private LocalDateTime createTime;
}
