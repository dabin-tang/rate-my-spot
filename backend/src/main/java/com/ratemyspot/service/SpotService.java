package com.ratemyspot.service;

import com.ratemyspot.response.PageResult;
import com.ratemyspot.response.SpotResponse;
import com.ratemyspot.util.Result;

import java.util.List;

public interface SpotService {
    /**
     * Get a paginated list of spots based on filters and sorting strategy.
     */
    Result<PageResult<SpotResponse>> getSpotList(Long categoryId, String sort, Double lat, Double lon, Integer page);

    /**
     * Search spots by keyword.
     */
    Result<List<SpotResponse>> search(String keyword);

    /**
     * Get spot detail by ID.
     */
    Result<SpotResponse> getSpotDetail(Long id);

    /**
     * Asynchronously update spot rating and review count.
     */
    void updateSpotRatingAsync(Long spotId);
}