package com.ratemyspot.service.impl;

import com.ratemyspot.dto.ReportCreateDTO;
import com.ratemyspot.entity.Report;
import com.ratemyspot.exception.BusinessException;
import com.ratemyspot.repository.ReportRepository;
import com.ratemyspot.service.ReportService;
import com.ratemyspot.util.Constants;
import com.ratemyspot.util.Result;
import com.ratemyspot.util.UserContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;

    private static final Set<String> VALID_TARGET_TYPES = Set.of("POST", "COMMENT", "REVIEW");

    /** Submit a content report. Validates targetType and persists the record. */
    @Override
    @Transactional
    public Result<String> submitReport(ReportCreateDTO dto) {
        String type = dto.getTargetType().toUpperCase();
        if (!VALID_TARGET_TYPES.contains(type)) {
            throw new BusinessException(Constants.ERR_INVALID_ACTION);
        }

        LocalDateTime now = LocalDateTime.now();
        Report report = new Report()
                .setUserId(UserContext.getCurrentUserId())
                .setTargetType(type)
                .setTargetId(dto.getTargetId())
                .setReason(dto.getReason())
                .setStatus(Constants.REPORT_STATUS_PENDING)
                .setCreateTime(now)
                .setUpdateTime(now);

        Report saved = reportRepository.save(report);
        return Result.ok("Report submitted successfully. Report ID: " + saved.getId());
    }
}
