package com.ratemyspot.controller;

import com.ratemyspot.dto.ReportCreateDTO;
import com.ratemyspot.service.ReportService;
import com.ratemyspot.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/report")
@Tag(name = "Report Controller", description = "Submit content reports for moderation")
@RequiredArgsConstructor
@Slf4j
public class ReportController {

    private final ReportService reportService;

    /**
     * Submit a report for a post, comment, or review.
     *
     * @param dto report details (targetType, targetId, reason)
     * @return success message containing the new report ID
     */
    @PostMapping
    @Operation(summary = "Submit Report", description = "Report a post, comment, or review for moderation.")
    public Result<String> submitReport(@Valid @RequestBody ReportCreateDTO dto) {
        log.info("Submit report: targetType={}, targetId={}", dto.getTargetType(), dto.getTargetId());
        return reportService.submitReport(dto);
    }
}
