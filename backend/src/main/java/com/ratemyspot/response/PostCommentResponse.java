package com.ratemyspot.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@Schema(name = "PostCommentResponse", description = "Comment tree node returned to frontend")
public class PostCommentResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "Comment ID", example = "100")
    private Long id;

    @Schema(description = "Target Post ID", example = "500")
    private Long postId;

    @Schema(description = "Commenter User ID", example = "2002")
    private Long userId;

    @Schema(description = "Commenter Nickname", example = "Dabin")
    private String userNickname;

    @Schema(description = "Commenter Icon URL", example = "img.jpg")
    private String userIcon;

    @Schema(description = "Parent Comment ID (0 or null if root)", example = "0")
    private Long parentId;

    @Schema(description = "Target User ID being replied to", example = "2003")
    private Long replyToUserId;

    @Schema(description = "Target User Nickname being replied to", example = "Alice")
    private String replyToUserNickname;

    @Schema(description = "Comment Content", example = "Great spot!")
    private String content;

    @Schema(description = "Comment Image URL", example = "img.jpg")
    private String image;

    @Schema(description = "Like Count", example = "5")
    private Integer liked;

    @Schema(description = "Whether current user has liked this comment", example = "true")
    private Boolean isLiked;

    @Schema(description = "Comment Time")
    private LocalDateTime createTime;

    @Schema(description = "Nested child replies")
    private List<PostCommentResponse> children = new ArrayList<>();
}
