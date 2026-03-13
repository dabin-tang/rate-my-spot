package com.ratemyspot.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Data
@NoArgsConstructor
@Accessors(chain = true)
@Schema(name = "ResolveReportDTO", description = "Request body for resolving a report ticket")
public class ResolveReportDTO {

    /**
     * Target status to set for this report:
     * 1 = Resolved (delete the reported content, type inferred from targetType)
     * 2 = Rejected (ignore the report, no content deletion)
     */
    @NotNull(message = "Status cannot be null")
    @Min(value = 1, message = "Status must be 1 (Resolved) or 2 (Rejected)")
    @Max(value = 2, message = "Status must be 1 (Resolved) or 2 (Rejected)")
    @Schema(description = "status: 1=Resolved (delete content), 2=Rejected (ignore report)",
            example = "1")
    private Integer status;

    @Schema(description = "Admin remark or reason", example = "Content violates community guidelines.")
    private String adminRemark;
}
