package com.ratemyspot.service;

import com.ratemyspot.response.SpotResponse;
import com.ratemyspot.util.Result;
import org.springframework.data.domain.Page;

import java.util.List;

public interface SpotService {
    /**
     * Get a paginated list of spots based on filters and sorting strategy.
     */
    Result<Page<SpotResponse>> getSpotList(Long categoryId, String sort, Double lat, Double lon, Integer page);

    /**
     * Search spots by keyword.
     */
    Result<List<SpotResponse>> search(String keyword);

    /**
     * Get spot detail by ID.
     */
    Result<SpotResponse> getSpotDetail(Long id);
}