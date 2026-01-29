package com.ratemyspot.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "follow")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(name = "Follow", description = "User Follow Relationship Entity")
public class Follow implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Primary Key
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Relationship ID", example = "100")
    private Long id;

    /**
     * Follower ID (Who is following)
     */
    @Column(name = "user_id", nullable = false)
    @Schema(description = "Follower User ID", example = "1001")
    private Long userId;

    /**
     * Target ID (Who is being followed)
     */
    @Column(name = "follow_user_id", nullable = false)
    @Schema(description = "Target User ID (Being Followed)", example = "1002")
    private Long followUserId;

    /**
     * Relationship Creation Time
     */
    @Column(name = "create_time", nullable = false)
    @Schema(description = "Follow Time")
    private LocalDateTime createTime;
}