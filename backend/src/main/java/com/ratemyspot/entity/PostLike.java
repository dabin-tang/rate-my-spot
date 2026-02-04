package com.ratemyspot.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "post_like")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(name = "PostLike", description = "Post Like Record Entity")
public class PostLike implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Primary Key
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Record ID", example = "1")
    private Long id;

    /**
     * Post ID
     */
    @NotNull(message = "Post ID cannot be null")
    @Column(name = "post_id", nullable = false)
    @Schema(description = "Liked Post ID", example = "500")
    private Long postId;

    /**
     * User ID
     */
    @NotNull(message = "User ID cannot be null")
    @Column(name = "user_id", nullable = false)
    @Schema(description = "User ID who liked the post", example = "2002")
    private Long userId;

    /**
     * Creation Time
     */
    @Column(name = "create_time", nullable = false)
    @Schema(description = "Like Time")
    private LocalDateTime createTime;
}