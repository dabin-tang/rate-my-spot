package com.ratemyspot.service.impl;

import com.ratemyspot.dto.PostCreateDTO;
import com.ratemyspot.repository.FollowRepository;
import com.ratemyspot.repository.PostLikeRepository;
import com.ratemyspot.repository.SpotCategoryRepository;
import com.ratemyspot.repository.SpotRepository;
import com.ratemyspot.dto.PostFeedRequestDTO;
import com.ratemyspot.response.PostResponse;
import com.ratemyspot.entity.Post;
import com.ratemyspot.entity.Spot;
import com.ratemyspot.entity.SpotCategory;
import com.ratemyspot.repository.PostRepository;
import com.ratemyspot.service.PostService;
import com.ratemyspot.util.CacheUtil;
import com.ratemyspot.util.Constants;
import com.ratemyspot.util.Result;
import com.ratemyspot.util.UserContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final SpotRepository spotRepository;
    private final SpotCategoryRepository spotCategoryRepository;
    private final PostLikeRepository postLikeRepository;
    private final FollowRepository followRepository;
    private final CacheUtil cacheUtil;

    /**
     * Get post details.
     */
    @Override
    public Result<PostResponse> getDetail(Long id) {
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

        // Set the current Like and Follow status
        if (userId != null) {
            boolean isLiked = postLikeRepository.existsByUserIdAndPostId(userId, id);
            boolean isFollow = followRepository.existsByUserIdAndFollowUserId(userId, response.getUserId());
            response.setIsLiked(isLiked);
            response.setIsFollow(isFollow);
        }

        return Result.ok(response);
    }
    
    /**
     * Get post feed.
     */
    @Override
    public Result<Page<PostResponse>> feed(PostFeedRequestDTO dto) {
        // 1. Build PageRequest (Spring uses 0-based index)
        PageRequest pageable = PageRequest.of(dto.getPage() - 1, dto.getSize());

        // 2. Query Repository directly
        // The repository now returns Page<PostResponse>, so no mapping logic is needed here.
        Page<PostResponse> responsePage = postRepository.findFeedVO(
                dto.getCategoryId(),
                dto.getSort(),
                pageable
        );
        return Result.ok(responsePage);
    }

    /**
     * Create a new post.
     */
    @Override
    @Transactional
    public Result<PostResponse> create(PostCreateDTO postCreateDTO) {
        // 1. Get current user
        Long userId = UserContext.getCurrentUserId();
        String nickname = UserContext.getCurrentUser().getNickname();
        String icon = UserContext.getCurrentUser().getIcon();

        // 2. Convert DTO to Entity
        Post post = new Post();
        BeanUtils.copyProperties(postCreateDTO, post);

        // 3. Set additional fields
        post.setUserId(userId)
                .setUserNickname(nickname)
                .setUserIcon(icon)
                .setLiked(0)
                .setStatus(0) // 0: Active
                .setCreateTime(LocalDateTime.now())
                .setUpdateTime(LocalDateTime.now());

        // 4. Save to database
        postRepository.save(post);

        // 5. Convert to Response VO
        PostResponse response = new PostResponse();
        BeanUtils.copyProperties(post, response);

        return Result.ok(response);
    }
}