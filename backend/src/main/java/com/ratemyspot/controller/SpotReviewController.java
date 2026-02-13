package com.ratemyspot.controller;

import com.ratemyspot.dto.SpotReviewCreateDTO;
import com.ratemyspot.dto.SpotReviewPageReq;
import com.ratemyspot.response.PageResult;
import com.ratemyspot.response.SpotReviewResponse;
import com.ratemyspot.service.SpotReviewService;
import com.ratemyspot.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/spot-review")
@Tag(name = "Spot Review Interface")
@RequiredArgsConstructor
@Slf4j
public class SpotReviewController {

    private final SpotReviewService spotReviewService;

    @Operation(summary = "Get Spot Review List")
    @GetMapping("/list")
    public Result<PageResult<SpotReviewResponse>> SpotReviewList(@ModelAttribute @Valid SpotReviewPageReq req) {
        return spotReviewService.SpotReviewList(req);
    }

    @Operation(summary = "Create Spot Review")
    @PostMapping("/create")
    public Result<SpotReviewResponse> createSpotReview(@RequestBody @Valid SpotReviewCreateDTO dto) {
        return spotReviewService.createSpotReview(dto);
    }
}