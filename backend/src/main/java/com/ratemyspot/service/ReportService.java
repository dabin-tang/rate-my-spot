package com.ratemyspot.service;

import com.ratemyspot.dto.ReportCreateDTO;
import com.ratemyspot.util.Result;

public interface ReportService {

    /** Submit a report for a post, comment, or review. Returns the saved report ID. */
    Result<String> submitReport(ReportCreateDTO dto);
}
