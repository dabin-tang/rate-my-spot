package com.ratemyspot.service.impl;

import com.ratemyspot.entity.PostLike;
import com.ratemyspot.repository.PostLikeRepository;
import com.ratemyspot.repository.PostRepository;
import com.ratemyspot.response.PageResult;
import com.ratemyspot.response.PostResponse;
import com.ratemyspot.service.PostLikeService;
import com.ratemyspot.util.Constants;
import com.ratemyspot.util.Result;
import com.ratemyspot.util.UserContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class PostLikeServiceImpl implements PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * Toggle like status for a post.
     */
    @Override
    @Transactional
    public Result<Void> toggle(Long postId) {
        // 1. Get current user
        Long userId = UserContext.getCurrentUserId();
        
        // 2. Check if already liked
        boolean isLiked = postLikeRepository.existsByUserIdAndPostId(userId, postId);

        if (isLiked) {
            // 3. If Liked -> Unlike
            // 3.1 Delete record
            postLikeRepository.deleteByUserIdAndPostId(userId, postId);
            // 3.2 Decrement post liked count
            postRepository.decrementLiked(postId);
        } else {
            // 4. If Not Liked -> Like
            // 4.1 Create record
            PostLike postLike = new PostLike();
            postLike.setPostId(postId)
                    .setUserId(userId)
                    .setCreateTime(LocalDateTime.now());
            postLikeRepository.save(postLike);
            // 4.2 Increment post liked count
            postRepository.incrementLiked(postId);
        }

        // 5. Clear Cache (Post Detail Cache)
        String cacheKey = Constants.CACHE_POST_KEY + postId;
        redisTemplate.delete(cacheKey);

        return Result.ok();
    }

    /**
     * Get list of posts liked by current user.
     */
    @Override
    public Result<PageResult<PostResponse>> getLikedPosts(Integer page, Integer size) {
        Long userId = UserContext.getCurrentUserId();
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<PostResponse> pageResult = postLikeRepository.findLikedPosts(userId, pageable);

        PageResult<PostResponse> result = new PageResult<>(
                page,
                size,
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.getContent()
        );

        return Result.ok(result);
    }
}