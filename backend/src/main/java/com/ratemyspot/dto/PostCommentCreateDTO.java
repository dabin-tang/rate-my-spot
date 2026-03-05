package com.ratemyspot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@Schema(name = "PostCommentCreateDTO", description = "Request body for creating a post comment")
public class PostCommentCreateDTO {

    @NotNull(message = "Post ID cannot be null")
    @Schema(description = "Target Post ID", example = "500")
    private Long postId;

    @NotNull(message = "User ID cannot be null")
    @Schema(description = "Commenter User ID", example = "2002")
    private Long userId;

    @Schema(description = "Parent Comment ID (0 or null if root)", example = "0")
    private Long parentId;

    @Schema(description = "Target User ID being replied to", example = "2003")
    private Long replyToUserId;

    @Size(max = 1024, message = "Content must be less than 1024 characters")
    @Schema(description = "Comment Content", example = "Great spot!")
    private String content;

    @Size(max = 255, message = "Image URL must be less than 255 characters")
    @Schema(description = "Comment Image URL", example = "img.jpg")
    private String image;
}
