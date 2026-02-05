package com.ratemyspot.service.impl;

import com.ratemyspot.entity.SpotCategory;
import com.ratemyspot.repository.SpotCategoryRepository;
import com.ratemyspot.response.SpotCategoryResponse;
import com.ratemyspot.service.SpotCategoryService;
import com.ratemyspot.util.CacheUtil;
import com.ratemyspot.util.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class SpotCategoryServiceImpl implements SpotCategoryService {

    private final SpotCategoryRepository spotCategoryRepository;
    private final CacheUtil cacheUtil;

    @Override
    @SuppressWarnings("unchecked")
    public Result<List<SpotCategoryResponse>> getCategoryList() {
        // Define cache key
        String key = "spot:category:list";

        // Use CacheUtil with Pass-Through protection
        // Queries cache first. If missing, queries DB (via lambda), caches result, and returns.
        List<SpotCategoryResponse> responseList = cacheUtil.queryWithPassThrough(
                key,
                List.class,
                1L,
                TimeUnit.HOURS,
                k -> {
                    // DB Fallback logic
                    List<SpotCategory> categoryList = spotCategoryRepository.findAllByOrderBySortAsc();
                    
                    // Convert to VO
                    return categoryList.stream().map(entity -> {
                        SpotCategoryResponse response = new SpotCategoryResponse();
                        BeanUtils.copyProperties(entity, response);
                        return response;
                    }).toList();
                }
        );

        return Result.ok(responseList);
    }
}