package com.ratemyspot.service.impl;

import com.ratemyspot.entity.SpotCategory;
import com.ratemyspot.repository.SpotCategoryRepository;
import com.ratemyspot.response.SpotCategoryResponse;
import com.ratemyspot.service.SpotCategoryService;
import com.ratemyspot.util.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class SpotCategoryServiceImpl implements SpotCategoryService {

    private final SpotCategoryRepository spotCategoryRepository;
    private final RedisTemplate<String, SpotCategory> redisTemplate;

    @Override
    public Result<List<SpotCategoryResponse>> getCategoryList() {
        // Define cache key
        String key = "spot:category:list";

        List<SpotCategory> categoryList;

        // Try to fetch from Redis cache
        List<SpotCategory> cachedList = redisTemplate.opsForList().range(key, 0, -1);
        if (cachedList != null && !cachedList.isEmpty()) {
            categoryList = cachedList;
        } else {
            // Query database if cache miss
            categoryList = spotCategoryRepository.findAllByOrderBySortAsc();

            // Update Redis cache
            if (categoryList != null && !categoryList.isEmpty()) {
                redisTemplate.delete(key);
                redisTemplate.opsForList().rightPushAll(key, categoryList);
                // Set expiration time to 1 hour
                redisTemplate.expire(key, 1, TimeUnit.HOURS);
            }
        }

        // Convert Entity list to Response list
        List<SpotCategoryResponse> responseList = categoryList.stream().map(entity -> {
            SpotCategoryResponse response = new SpotCategoryResponse();
            BeanUtils.copyProperties(entity, response);
            return response;
        }).toList();

        return Result.ok(responseList);
    }
}