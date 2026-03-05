package com.ratemyspot.service.impl;

import com.ratemyspot.entity.Follow;
import com.ratemyspot.exception.BusinessException;
import com.ratemyspot.repository.FollowRepository;
import com.ratemyspot.response.PageResult;
import com.ratemyspot.response.UserResponse;
import com.ratemyspot.service.FollowService;
import com.ratemyspot.util.Constants;
import com.ratemyspot.util.Result;
import com.ratemyspot.util.UserContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {

    private final FollowRepository followRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * Toggle follow status for a target user.
     * Cache strategy: Redis Set (cache:user:following:{userId}) stores all followUserIds the current user follows.
     * Priority: check cache first → operate DB → sync cache.
     */
    @Override
    @Transactional
    public Result<Void> toggle(Long targetUserId) {
        Long currentUserId = UserContext.getCurrentUserId();

        if (currentUserId.equals(targetUserId)) {
            throw new BusinessException(Constants.ERR_FOLLOW_SELF);
        }

        String followingKey = Constants.CACHE_USER_FOLLOWING_KEY + currentUserId;

        // 1. Check follow status from Redis first
        Boolean isFollowing = redisTemplate.opsForSet().isMember(followingKey, targetUserId);

        if (Boolean.TRUE.equals(isFollowing)) {
            // 2. Unfollow: delete record from DB, decrement target user's followers count
            followRepository.deleteByUserIdAndFollowUserId(currentUserId, targetUserId);
            // delete cache
            redisTemplate.opsForSet().remove(followingKey, targetUserId);
        } else {
            // 3. Follow: insert record into DB, increment target user's followers count
            Follow follow = new Follow();
            follow.setUserId(currentUserId)
                    .setFollowUserId(targetUserId)
                    .setCreateTime(LocalDateTime.now());
            followRepository.save(follow);
            // delete cache
            redisTemplate.opsForSet().add(followingKey, targetUserId);
        }

        return Result.ok();
    }

    /**
     * Get paginated list of followers for the current user.
     */
    @Override
    public Result<PageResult<UserResponse>> getFollowers(Integer pageNum, Integer pageSize) {
        Long currentUserId = UserContext.getCurrentUserId();
        PageRequest pageable = PageRequest.of(pageNum - 1, pageSize);
        Page<UserResponse> page = followRepository.findFollowersVO(currentUserId, pageable);
        PageResult<UserResponse> result = new PageResult<>(
                pageNum, pageSize,
                page.getTotalElements(),
                page.getTotalPages(),
                page.getContent()
        );
        return Result.ok(result);
    }

    /**
     * Get paginated list of users the current user is following.
     */
    @Override
    public Result<PageResult<UserResponse>> getFollowing(Integer pageNum, Integer pageSize) {
        Long currentUserId = UserContext.getCurrentUserId();
        PageRequest pageable = PageRequest.of(pageNum - 1, pageSize);
        Page<UserResponse> page = followRepository.findFollowingVO(currentUserId, pageable);
        PageResult<UserResponse> result = new PageResult<>(
                pageNum, pageSize,
                page.getTotalElements(),
                page.getTotalPages(),
                page.getContent()
        );
        return Result.ok(result);
    }
}
