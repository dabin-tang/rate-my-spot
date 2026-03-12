package com.ratemyspot.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "report")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(name = "Report", description = "Report Entity for content moderation")
public class Report implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Primary Key ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Report ID", example = "1")
    private Long id;

    /**
     * Foreign Key: User ID (Who reported it)
     */
    @NotNull(message = "User ID cannot be null")
    @Column(name = "user_id", nullable = false)
    @Schema(description = "User ID of the reporter", example = "1001")
    private Long userId;

    /**
     * Type of content: POST, COMMENT, or REVIEW
     */
    @NotBlank(message = "Target type cannot be empty")
    @Size(max = 32, message = "Target type must be less than 32 characters")
    @Column(name = "target_type", length = 32, nullable = false)
    @Schema(description = "Type of content reported (e.g., POST, COMMENT, REVIEW)", example = "POST")
    private String targetType;

    /**
     * ID of the reported content
     */
    @NotNull(message = "Target ID cannot be null")
    @Column(name = "target_id", nullable = false)
    @Schema(description = "ID of the reported content", example = "505")
    private Long targetId;

    /**
     * Reason for reporting
     */
    @NotBlank(message = "Reason cannot be empty")
    @Size(max = 255, message = "Reason must be less than 255 characters")
    @Column(name = "reason", length = 255, nullable = false)
    @Schema(description = "Reason for reporting", example = "Spam content and inappropriate language")
    private String reason;

    /**
     * Status: 0-Pending, 1-Resolved (Deleted), 2-Rejected (Ignored)
     */
    @Column(name = "status")
    @Schema(description = "Report Status (0:Pending, 1:Resolved, 2:Rejected)", example = "0")
    private Integer status;

    /**
     * Admin Note/Remark
     */
    @Size(max = 255, message = "Admin remark must be less than 255 characters")
    @Column(name = "admin_remark", length = 255)
    @Schema(description = "Note from admin after handling the report", example = "Content removed due to violation of TOS.")
    private String adminRemark;

    /**
     * Creation Time
     */
    @Column(name = "create_time", nullable = false, updatable = false)
    @Schema(description = "Report submitted time")
    private LocalDateTime createTime;

    /**
     * Update Time
     */
    @Column(name = "update_time", nullable = false)
    @Schema(description = "Report handled time")
    private LocalDateTime updateTime;
}