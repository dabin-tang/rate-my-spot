package com.ratemyspot.service;
 
import com.ratemyspot.response.SpotCategoryResponse;
import com.ratemyspot.util.Result;
import java.util.List;

public interface SpotCategoryService {

    /**
     * Get all spot categories.
     *
     * @return Result of List of SpotCategoryResponse
     */
    Result<List<SpotCategoryResponse>> getCategoryList();
}