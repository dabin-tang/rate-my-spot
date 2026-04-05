package com.ratemyspot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(name = "ReportCreateDTO", description = "Request body for submitting a report")
public class ReportCreateDTO {

    @NotBlank(message = "Target type cannot be empty")
    @Schema(description = "Type of content being reported", example = "POST",
            allowableValues = {"POST", "COMMENT", "REVIEW"})
    private String targetType;

    @NotNull(message = "Target ID cannot be null")
    @Schema(description = "ID of the reported content", example = "505")
    private Long targetId;

    @NotBlank(message = "Reason cannot be empty")
    @Size(max = 255, message = "Reason must be less than 255 characters")
    @Schema(description = "Reason for the report", example = "Spam content")
    private String reason;
}
