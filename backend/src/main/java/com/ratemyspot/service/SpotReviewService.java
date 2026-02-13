package com.ratemyspot.service;

import com.ratemyspot.dto.SpotReviewPageReq;
import com.ratemyspot.response.PageResult;
import com.ratemyspot.response.SpotReviewResponse;
import com.ratemyspot.util.Result;

public interface SpotReviewService {
    /**
     * Get verified reviews for a specific spot (Pagination).
     *
     * @param req Pagination request
     * @return Page of Review Responses
     */
    Result<PageResult<SpotReviewResponse>> SpotReviewList(SpotReviewPageReq req);

    /**
     * Create a new spot review.
     */
    Result<SpotReviewResponse> createSpotReview(com.ratemyspot.dto.SpotReviewCreateDTO dto);
}