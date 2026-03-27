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
        Long userId = UserContext.getCurrentUserId();
        String likesKey = Constants.CACHE_POST_LIKES_KEY + postId;

        // 1. Check like status from DB directly to survive Redis flushes
        boolean isLiked = postLikeRepository.existsByUserIdAndPostId(userId, postId);

        if (isLiked) {
            // 2. Unlike: delete record from DB, decrement liked count
            postLikeRepository.deleteByUserIdAndPostId(userId, postId);
            postRepository.decrementLiked(postId);
            // remove userId from the Redis like set
            redisTemplate.opsForSet().remove(likesKey, userId);
        } else {
            // 3. Like: insert record into DB, increment liked count
            PostLike postLike = new PostLike();
            postLike.setPostId(postId)
                    .setUserId(userId)
                    .setCreateTime(LocalDateTime.now());
            postLikeRepository.save(postLike);
            postRepository.incrementLiked(postId);
            // add userId to the Redis like set
            redisTemplate.opsForSet().add(likesKey, userId);
        }

        // 4. Delete post detail cache to keep liked count consistent
        redisTemplate.delete(Constants.CACHE_POST_KEY + postId);

        return Result.ok();
    }

    /**
     * Get list of posts liked by target user.
     * Respects the target user's privacy setting.
     */
    @Override
    public Result<PageResult<PostResponse>> getLikedPosts(Long targetUserId, Integer page, Integer size) {
        if (targetUserId == null) {
            return Result.fail(Constants.ERR_USER_NOT_LOGIN);
        }

        Long currentUserId = UserContext.getCurrentUserId();

        // Privacy check: if viewing someone else's list, check if target has set it to private
        if (currentUserId == null || !currentUserId.equals(targetUserId)) {
            String privacyKey = Constants.CACHE_USER_LIKES_PRIVACY_KEY + targetUserId;
            Object privacy = redisTemplate.opsForValue().get(privacyKey);
            if ("1".equals(privacy)) {
                return Result.fail("This user's liked posts are private");
            }
        }

        Pageable pageable = PageRequest.of(page - 1, size);
        Page<PostResponse> pageResult = postLikeRepository.findLikedPosts(targetUserId, pageable);

        // If viewing someone else's liked posts, we must verify if the viewer also likes them
        if (currentUserId != null && !currentUserId.equals(targetUserId)) {
            for (PostResponse post : pageResult.getContent()) {
                boolean isLiked = postLikeRepository.existsByUserIdAndPostId(currentUserId, post.getId());
                post.setIsLiked(isLiked);
            }
        } else {
            // My own liked posts: isLiked is always true
            pageResult.getContent().forEach(post -> post.setIsLiked(true));
        }

        PageResult<PostResponse> result = new PageResult<>(
                page,
                size,
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.getContent()
        );

        return Result.ok(result);
    }

    /**
     * Set the privacy of the current user's liked posts list.
     * isPrivate=true  → store "1" in Redis (private)
     * isPrivate=false → delete the key (public, default)
     */
    @Override
    public Result<Void> setLikesPrivacy(Boolean isPrivate) {
        Long userId = UserContext.getCurrentUserId();
        String privacyKey = Constants.CACHE_USER_LIKES_PRIVACY_KEY + userId;
        if (Boolean.TRUE.equals(isPrivate)) {
            redisTemplate.opsForValue().set(privacyKey, "1");
        } else {
            redisTemplate.delete(privacyKey);
        }
        return Result.ok();
    }
}