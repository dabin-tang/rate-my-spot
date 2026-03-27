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
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {

    private final FollowRepository followRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * Toggle follow status for a target user.
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
            // 2. Unfollow: delete record from DB
            followRepository.deleteByUserIdAndFollowUserId(currentUserId, targetUserId);
            // remove from Redis Set
            redisTemplate.opsForSet().remove(followingKey, targetUserId);
        } else {
            // 3. Follow: insert record into DB
            Follow follow = new Follow();
            follow.setUserId(currentUserId)
                    .setFollowUserId(targetUserId)
                    .setCreateTime(LocalDateTime.now());
            followRepository.save(follow);
            // add to Redis Set
            redisTemplate.opsForSet().add(followingKey, targetUserId);
        }

        return Result.ok();
    }

    /**
     * Get paginated list of followers for the given user.
     */
    @Override
    public Result<PageResult<UserResponse>> getFollowers(Long userId, Integer pageNum, Integer pageSize) {
        Long targetUserId = userId != null ? userId : UserContext.getCurrentUserId();
        if (targetUserId == null) {
            throw new BusinessException(Constants.ERR_USER_NOT_LOGIN);
        }
        PageRequest pageable = PageRequest.of(pageNum - 1, pageSize);
        Page<UserResponse> page = followRepository.findFollowersVO(targetUserId, pageable);
        
        injectFollowStatus(page.getContent(), UserContext.getCurrentUserId());

        PageResult<UserResponse> result = new PageResult<>(
                pageNum, pageSize,
                page.getTotalElements(),
                page.getTotalPages(),
                page.getContent()
        );
        return Result.ok(result);
    }

    /**
     * Get paginated list of users the given user is following.
     */
    @Override
    public Result<PageResult<UserResponse>> getFollowing(Long userId, Integer pageNum, Integer pageSize) {
        Long targetUserId = userId != null ? userId : UserContext.getCurrentUserId();
        if (targetUserId == null) {
            throw new BusinessException(Constants.ERR_USER_NOT_LOGIN);
        }
        PageRequest pageable = PageRequest.of(pageNum - 1, pageSize);
        Page<UserResponse> page = followRepository.findFollowingVO(targetUserId, pageable);
        
        injectFollowStatus(page.getContent(), UserContext.getCurrentUserId());

        PageResult<UserResponse> result = new PageResult<>(
                pageNum, pageSize,
                page.getTotalElements(),
                page.getTotalPages(),
                page.getContent()
        );
        return Result.ok(result);
    }

    /**
     * Injects the "isFollow" status into a list of UserResponse.
     */
    private void injectFollowStatus(List<UserResponse> users, Long currentUserId) {
        if (currentUserId == null || users == null || users.isEmpty()) {
            return;
        }

        // Extract a flat list of target IDs for all users currently displayed in the pagination result
        List<Long> targetUserIds = users.stream()
                .map(UserResponse::getId)
                .collect(Collectors.toList());

        // This returns ONLY the subset of IDs that the current user is actively following.
        List<Long> followedIds = followRepository.findFollowingIds(currentUserId, targetUserIds);

        Set<Long> followedIdSet = new HashSet<>(followedIds);

        // Iterate through the paginated user list and set isFollow.
        for (UserResponse user : users) {
             user.setIsFollow(followedIdSet.contains(user.getId()));
        }
    }
}
