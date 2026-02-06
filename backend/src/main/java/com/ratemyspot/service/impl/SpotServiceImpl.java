package com.ratemyspot.service.impl;

import com.ratemyspot.entity.Spot;
import com.ratemyspot.exception.BusinessException;
import com.ratemyspot.repository.SpotRepository;
import com.ratemyspot.response.SpotResponse;
import com.ratemyspot.service.SpotService;
import com.ratemyspot.util.Constants;
import com.ratemyspot.util.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.ratemyspot.util.CacheUtil;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class SpotServiceImpl implements SpotService {

    private final SpotRepository spotRepository;
    private final CacheUtil cacheUtil;

    /**
     * Retrieves a paginated list of spots with dynamic sorting strategies.
     */
    @Override
    public Result<Page<SpotResponse>> getSpotList(Long categoryId, String sort, Double lat, Double lon, Integer page) {
        Pageable pageable = PageRequest.of(page - 1, 20); // Page is 1-indexed in API, 0-indexed in JPA
        Page<Spot> spotPage;

        if ("distance".equalsIgnoreCase(sort)) {
            // Sort by distance using custom JPQL
            spotPage = spotRepository.findByFilterOrderByDistance(categoryId, lat, lon, pageable);
        } else if ("score".equalsIgnoreCase(sort)) {
            // Sort by score descending
            spotPage = spotRepository.findByFilterOrderByScore(categoryId, pageable);
        } else {
            // Default sort (e.g. by ID)
            spotPage = spotRepository.findByFilterDefault(categoryId, pageable);
        }

        Page<SpotResponse> responsePage = spotPage.map(spot -> {
            SpotResponse response = new SpotResponse();
            BeanUtils.copyProperties(spot, response);
            return response;
        });

        return Result.ok(responsePage);
    }

    /**
     * Searches for spots where name or description contains the keyword.
     */
    @Override
    public Result<List<SpotResponse>> search(String keyword) {
        List<Spot> spotList = spotRepository.findByNameContainingOrDescriptionContaining(keyword, keyword);

        List<SpotResponse> responseList = spotList.stream().map(spot -> {
            SpotResponse response = new SpotResponse();
            BeanUtils.copyProperties(spot, response);
            return response;
        }).collect(Collectors.toList());

        return Result.ok(responseList);
    }

    /**
     * Get spot detail by ID.
     */
    @Override
    public Result<SpotResponse> getSpotDetail(Long id) {
        String key = Constants.CACHE_SPOT_KEY + id;
        
        // Logical Expiration: 20 seconds
        SpotResponse spotResponse = cacheUtil.queryWithLogicalExpire(
                key,
                SpotResponse.class,
                Constants.CACHE_SPOT_LOCK_WAIT,
                Constants.CACHE_SPOT_LOCK_LEASE,
                TimeUnit.SECONDS,
                Constants.CACHE_SPOT_LOGICAL_EXPIRE,
                TimeUnit.SECONDS,
                k -> {
                    Spot spot = spotRepository.findById(id).orElse(null);
                    if (spot == null) {
                        return null;
                    }
                    SpotResponse response = new SpotResponse();
                    BeanUtils.copyProperties(spot, response);
                    return response;
                }
        );

        // Handle Cache Miss (Cold Start): Query DB and write to cache
        if (spotResponse == null) {
            Spot spot = spotRepository.findById(id)
                    .orElseThrow(() -> new BusinessException(Constants.ERR_SPOT_NOT_FOUND));

            spotResponse = new SpotResponse();
            BeanUtils.copyProperties(spot, spotResponse);
            
            // Write to cache with logical expiration
            cacheUtil.setWithLogicalExpire(key, spotResponse, Constants.CACHE_SPOT_LOGICAL_EXPIRE, TimeUnit.SECONDS);
        }

        return Result.ok(spotResponse);
    }
}