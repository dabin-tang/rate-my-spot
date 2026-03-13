package com.ratemyspot.service.impl;

import com.ratemyspot.dto.SpotReviewCreateDTO;
import com.ratemyspot.dto.SpotReviewPageReq;
import com.ratemyspot.dto.UserDTO;
import com.ratemyspot.entity.SpotReview;
import com.ratemyspot.exception.BusinessException;
import com.ratemyspot.response.PageResult;
import com.ratemyspot.response.SpotReviewResponse;
import com.ratemyspot.repository.SpotReviewRepository;
import com.ratemyspot.service.SpotReviewService;
import com.ratemyspot.service.SpotService;
import com.ratemyspot.util.CacheUtil;
import com.ratemyspot.util.Constants;
import com.ratemyspot.util.Result;
import com.ratemyspot.util.UserContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class SpotReviewServiceImpl implements SpotReviewService {

    private final SpotReviewRepository spotReviewRepository;
    private final SpotService spotService;
    private final CacheUtil cacheUtil;
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * Get verified reviews for a specific spot (Pagination).
     */
    @Override
    public Result<PageResult<SpotReviewResponse>> SpotReviewList(SpotReviewPageReq req) {
        // 1. First Page Caching Strategy
        if (req.getPage() == 1) {
            String cacheKey = Constants.CACHE_SPOT_REVIEW_KEY + req.getSpotId() + ":p1";

            // queryWithPassThrough requires a specific class type.
            // Since Page<T> is an interface and generic, we use a wrapper or concrete class.
            // Here we use PageResult as the cached object.
            PageResult<SpotReviewResponse> cachedResult = cacheUtil.queryWithPassThrough(
                    cacheKey,
                    PageResult.class,
                    60L,
                    TimeUnit.SECONDS,
                    key -> queryDbForPage(req)
            );
            return Result.ok(cachedResult);
        }

        // 2. Non-First Page: Direct DB Query
        return Result.ok(queryDbForPage(req));
    }

    /**
     * Create a new spot review.
     */
    @Override
    @Transactional
    public Result<SpotReviewResponse> createSpotReview(SpotReviewCreateDTO dto) {
        // 1. Get current user
        Long userId = UserContext.getCurrentUserId();
        UserDTO currentUser = UserContext.getCurrentUser();
        String nickname = currentUser.getNickname();
        String icon = currentUser.getIcon();

        // 2. Create Entity
        SpotReview review = new SpotReview();
        review.setSpotId(dto.getSpotId())
                .setUserId(userId)
                .setRating(dto.getRating())
                .setContent(dto.getContent())
                .setCreateTime(LocalDateTime.now());

        if (dto.getImages() != null && !dto.getImages().isEmpty()) {
            review.setImages(String.join(",", dto.getImages()));
        }

        // 3. Save to DB
        spotReviewRepository.save(review);

        // 4. Async update spot rating (After Commit)
        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        spotService.updateSpotRatingAsync(dto.getSpotId());
                    }
                }
        );

        // 5. Clear First Page Cache
        String cacheKey = Constants.CACHE_SPOT_REVIEW_KEY + dto.getSpotId() + ":p1";
        redisTemplate.delete(cacheKey);

        // 6. Return Response
        SpotReviewResponse response = new SpotReviewResponse();
        BeanUtils.copyProperties(review, response);
        response.setUserNickname(nickname)
                .setUserIcon(icon)
                .setImages(dto.getImages());

        return Result.ok(response);
    }

    /**
     * Helper to query DB and convert to PageResult.
     */
    private PageResult<SpotReviewResponse> queryDbForPage(SpotReviewPageReq req) {
        Pageable pageable = PageRequest.of(req.getPage() - 1, req.getSize());
        Page<SpotReviewResponse> page = spotReviewRepository.findSpotReviewsPage(req.getSpotId(), pageable);
        
        return new PageResult<>(
            req.getPage(),
            req.getSize(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.getContent()
        );
    }

    /**
     * Force delete a review by ID (admin). Updates spot rating after deletion.
     */
    @Override
    @Transactional
    public Result<String> deleteReview(Long reviewId) {
        // Verify the review exists
        SpotReview review = spotReviewRepository.findById(reviewId)
                .orElseThrow(() -> new BusinessException(Constants.ERR_REVIEW_NOT_FOUND));
        Long spotId = review.getSpotId();
        // Delete the review
        spotReviewRepository.deleteById(reviewId);
        // Invalidate first-page cache for this spot's reviews
        String cacheKey = Constants.CACHE_SPOT_REVIEW_KEY + spotId + ":p1";
        redisTemplate.delete(cacheKey);
        // Async update spot rating after commit
        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        spotService.updateSpotRatingAsync(spotId);
                    }
                }
        );
        return Result.ok(Constants.MSG_REVIEW_DELETED);
    }
}