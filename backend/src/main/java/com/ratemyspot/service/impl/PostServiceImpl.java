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
        // 1. Get current user ID (Nullable)
        Long userId = UserContext.getCurrentUserId();

        // 2. Query Post with Cache Pass-Through Protection
        String key = Constants.CACHE_POST_KEY + id;
        Post post = cacheUtil.queryWithPassThrough(
                key,
                Post.class,
                Constants.CACHE_POST_TTL,
                TimeUnit.MINUTES,
                (k) -> postRepository.findById(id).orElse(null)
        );

        // 3. Validation
        if (post == null || post.getStatus() != 0) {
            return Result.fail(Constants.ERR_POST_NOT_FOUND);
        }

        // 4. Convert to Response VO
        PostResponse response = new PostResponse();
        BeanUtils.copyProperties(post, response);

        // 5. Fill Spot and Category Info
        Spot spot = spotRepository.findById(post.getSpotId()).orElse(null);
        if (spot != null) {
            response.setSpotName(spot.getName());
            SpotCategory category = spotCategoryRepository.findById(spot.getCategoryId()).orElse(null);
            if (category != null) {
                response.setCategoryName(category.getName());
            }
        }

        // 6. Interaction Status
        if (userId != null) {
            boolean isLiked = postLikeRepository.existsByUserIdAndPostId(userId, id);
            boolean isFollow = followRepository.existsByUserIdAndFollowUserId(userId, post.getUserId());
            
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
        // 1. Build PageRequest (Note: dbt uses 1-based page index, Spring uses 0-based)
        // Sort logic is handled in SQL, so we use Pageable.unpaged() or simple unsorted PageRequest for limits
        PageRequest pageable = PageRequest.of(dto.getPage() - 1, dto.getSize());

        // 2. Query Repository
        Page<PostRepository.PostFeedProjection> projectionPage = postRepository.findFeed(
                dto.getCategoryId(),
                dto.getSort(),
                pageable
        );

        // 3. Convert Projection to Response VO
        Page<PostResponse> responsePage = projectionPage.map(p -> new PostResponse()
                .setId(p.getId())
                .setSpotId(p.getSpotId())
                .setUserId(p.getUserId())
                .setTitle(p.getTitle())
                .setContent(p.getContent())
                .setImages(p.getImages())
                .setRating(p.getRating())
                .setLiked(p.getLiked())
                .setCreateTime(p.getCreateTime())
                .setUpdateTime(p.getCreateTime()) // Use createTime as fallback
                .setUserNickname(p.getUserNickname())
                .setUserIcon(p.getUserIcon())
                .setStatus(0) // Default active
                .setSpotName(p.getSpotName())
                .setCategoryName(p.getCategoryName())
                .setIsLiked(false)  // Default
                .setIsFollow(false) // Default
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