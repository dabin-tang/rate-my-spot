package com.ratemyspot.service.impl;

import com.ratemyspot.dto.SpotRatingDTO;
import com.ratemyspot.entity.Spot;
import com.ratemyspot.exception.BusinessException;
import com.ratemyspot.repository.SpotRepository;
import com.ratemyspot.response.PageResult;
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
import org.springframework.scheduling.annotation.Async;

import java.math.BigDecimal;
import java.math.RoundingMode;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class SpotServiceImpl implements SpotService {

    private final SpotRepository spotRepository;
    private final com.ratemyspot.repository.PostRepository postRepository;
    private final com.ratemyspot.repository.SpotReviewRepository spotReviewRepository;
    private final CacheUtil cacheUtil;
    private final org.springframework.data.redis.core.RedisTemplate<String, Object> redisTemplate;

    /**
     * Retrieves a paginated list of spots with dynamic sorting strategies.
     */
    @Override
    public Result<PageResult<SpotResponse>> getSpotList(Long categoryId, String sort, Double lat, Double lon, Integer page) {
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

        List<SpotResponse> responseList = spotPage.stream().map(spot -> {
            SpotResponse response = new SpotResponse();
            BeanUtils.copyProperties(spot, response);
            return response;
        }).collect(Collectors.toList());

        PageResult<SpotResponse> pageResult = new PageResult<>(
            page,
            20,
            spotPage.getTotalElements(),
            spotPage.getTotalPages(),
            responseList
        );

        return Result.ok(pageResult);
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

        // Use Pass-Through Protection instead of Logical Expiration
        SpotResponse spotResponse = cacheUtil.queryWithPassThrough(
                key,
                SpotResponse.class,
                Constants.CACHE_SPOT_TTL,
                TimeUnit.MINUTES,
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

        if (spotResponse == null) {
            return Result.fail(Constants.ERR_SPOT_NOT_FOUND);
        }

        return Result.ok(spotResponse);
    }

    /**
     * Asynchronously update spot rating and review count.
     */
    @Override
    @Async
    public void updateSpotRatingAsync(Long spotId) {
        // 1. Fetch aggregated stats from Post and SpotReview
        SpotRatingDTO postStats = postRepository.findPostRatingStats(spotId);
        SpotRatingDTO reviewStats = spotReviewRepository.findReviewRatingStats(spotId);

        // 2. Handle nulls (Just in case)
        long postCount = postStats != null && postStats.getCount() != null ? postStats.getCount() : 0L;
        double postAvg = postStats != null && postStats.getAvgScore() != null ? postStats.getAvgScore() : 0.0;

        long reviewCount = reviewStats != null && reviewStats.getCount() != null ? reviewStats.getCount() : 0L;
        double reviewAvg = reviewStats != null && reviewStats.getAvgScore() != null ? reviewStats.getAvgScore() : 0.0;

        // 3. Calculate Weighted Average
        long totalCount = postCount + reviewCount;
        double finalScore = 0.0;

        if (totalCount > 0) {
            BigDecimal totalSum = BigDecimal.valueOf(postCount).multiply(BigDecimal.valueOf(postAvg))
                    .add(BigDecimal.valueOf(reviewCount).multiply(BigDecimal.valueOf(reviewAvg)));

            finalScore = totalSum.divide(BigDecimal.valueOf(totalCount), 1, RoundingMode.HALF_UP).doubleValue();
        }

        // 4. Update Spot Entity
        Spot spot = spotRepository.findById(spotId).orElse(null);
        if (spot != null) {
            spot.setReviewCount((int) totalCount); // Cast to int as per entity definition
            spot.setScore(finalScore);
            spotRepository.save(spot);

            // 5. Clear Cache
            redisTemplate.delete(Constants.CACHE_SPOT_KEY + spotId);
            log.info("Updated spot rating for spotId: {}, newScore: {}, newCount: {}", spotId, finalScore, totalCount);
        }
    }

}