package com.ratemyspot.service.impl;

import com.ratemyspot.dto.PostCreateDTO;
import com.ratemyspot.dto.PostFeedRequestDTO;
import com.ratemyspot.response.PageResult;
import com.ratemyspot.response.PostResponse;
import com.ratemyspot.entity.Post;
import com.ratemyspot.repository.PostRepository;
import com.ratemyspot.response.RecentPostResponse;
import com.ratemyspot.service.PostService;
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
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final CacheUtil cacheUtil;
    private final SpotService spotService;
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * Get post details.
     */
    @Override
    public Result<PostResponse> getPostDetail(Long id) {
        // Get current user ID (nullable for guests)
        Long userId = UserContext.getCurrentUserId();

        // cache key
        String key = Constants.CACHE_POST_KEY + id;

        // Query with Cache Pass-Through Protection
        // If cache miss: The repository's findPostDetailVO fetches Post + SpotName + CategoryName in a single query.
        PostResponse response = cacheUtil.queryWithPassThrough(
                key,
                PostResponse.class,
                Constants.CACHE_POST_TTL,
                TimeUnit.MINUTES,
                (k) -> postRepository.findPostDetailVO(id)
        );

        //  Validate result
        if (response == null) {
            return Result.fail(Constants.ERR_POST_NOT_FOUND);
        }

        // Check like and follow status from Redis Sets
        if (userId != null) {
            Boolean liked = redisTemplate.opsForSet().isMember(Constants.CACHE_POST_LIKES_KEY + id, userId);
            Boolean follow = redisTemplate.opsForSet().isMember(Constants.CACHE_USER_FOLLOWING_KEY + userId, response.getUserId());
            response.setIsLiked(Boolean.TRUE.equals(liked));
            response.setIsFollow(Boolean.TRUE.equals(follow));
            
        }

        return Result.ok(response);
    }

    /**
     * Get post feed.
     */
    @Override
    public Result<PageResult<PostResponse>> feed(PostFeedRequestDTO dto) {
        // 1. Build PageRequest
        PageRequest pageable = PageRequest.of(dto.getPage() - 1, dto.getSize());

        // 2. Query Repository based on sort strategy
        Page<PostResponse> responsePage;
        if ("latest".equals(dto.getSort())) {
            responsePage = postRepository.findFeedLatest(dto.getCategoryId(), pageable);
        } else {
            // Default sort (random + liked)
            responsePage = postRepository.findFeedDefault(dto.getCategoryId(), pageable);
        }

        PageResult<PostResponse> pageResult = new PageResult<>(
                dto.getPage(),
                dto.getSize(),
                responsePage.getTotalElements(),
                responsePage.getTotalPages(),
                responsePage.getContent()
        );

        return Result.ok(pageResult);
    }

    /**
     * Create a new post.
     */
    @Override
    @Transactional
    public Result<PostResponse> createPost(PostCreateDTO postCreateDTO) {
        //  Get current user
        Long userId = UserContext.getCurrentUserId();
        String nickname = UserContext.getCurrentUser().getNickname();
        String icon = UserContext.getCurrentUser().getIcon();

        Post post = new Post();
        BeanUtils.copyProperties(postCreateDTO, post);

        // Set additional fields
        post.setUserId(userId)
                .setUserNickname(nickname)
                .setUserIcon(icon)
                .setLiked(0)
                .setStatus(0) // 0: Active
                .setCreateTime(LocalDateTime.now())
                .setUpdateTime(LocalDateTime.now());

        // Save to database
        postRepository.save(post);

        // Async update spot rating
        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        spotService.updateSpotRatingAsync(post.getSpotId());
                    }
                }
        );

        PostResponse response = new PostResponse();
        BeanUtils.copyProperties(post, response);

        return Result.ok(response);
    }

    /**
     * Get posts by user ID.
     */
    @Override
    public Result<PageResult<PostResponse>> getUserPosts(Long userId, Integer page, Integer size) {
        PageRequest pageable = PageRequest.of(page - 1, size);
        Page<PostResponse> responsePage = postRepository.findUserPostsVO(userId, pageable);

        PageResult<PostResponse> pageResult = new PageResult<>(
                page,
                size,
                responsePage.getTotalElements(),
                responsePage.getTotalPages(),
                responsePage.getContent()
        );

        return Result.ok(pageResult);
    }

    /**
     * Get recent posts for a spot.
     */
    @Override
    public Result<List<RecentPostResponse>> getRecentPosts(Long spotId) {
        // Fetch top 2 recent posts
        PageRequest pageable = PageRequest.of(0, 2);
        Page<RecentPostResponse> page = postRepository.findRecentPostsVO(spotId, pageable);
        return Result.ok(page.getContent());
    }

}
