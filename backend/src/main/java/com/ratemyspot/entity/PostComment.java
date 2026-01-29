package com.ratemyspot.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "post_comment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(name = "PostComment", description = "Comment on Post Entity")
public class PostComment implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Primary Key
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Comment ID", example = "100")
    private Long id;

    /**
     * Post ID (Foreign Key)
     */
    @Column(name = "post_id", nullable = false)
    @Schema(description = "Target Post ID", example = "500")
    private Long postId;

    /**
     * User ID (Foreign Key)
     */
    @Column(name = "user_id", nullable = false)
    @Schema(description = "Commenter User ID", example = "2002")
    private Long userId;

    /**
     * Parent Comment ID (0 for top-level comments)
     */
    @Column(name = "parent_id")
    @Schema(description = "Parent Comment ID (0 if root)", example = "0")
    private Long parentId;

    /**
     * Reply To User ID (Optional, for UI display)
     */
    @Column(name = "reply_to_user_id")
    @Schema(description = "Target User ID being replied to", example = "2003")
    private Long replyToUserId;

    /**
     * Text Content
     */
    @Column(name = "content", length = 1024)
    @Schema(description = "Comment Content", example = "I agree!")
    private String content;

    /**
     * Image URL (Single image)
     */
    @Column(name = "image", length = 255)
    @Schema(description = "Comment Image URL", example = "img.jpg")
    private String image;

    /**
     * Like Count
     */
    @Column(name = "liked")
    @Schema(description = "Like Count", example = "5")
    private Integer liked;

    /**
     * Creation Time
     */
    @Column(name = "create_time", nullable = false)
    @Schema(description = "Comment Time")
    private LocalDateTime createTime;
}