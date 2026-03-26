package com.ratemyspot.service;

import com.ratemyspot.dto.PostCreateDTO;
import com.ratemyspot.dto.PostFeedRequestDTO;
import com.ratemyspot.response.PageResult;
import com.ratemyspot.response.PostResponse;
import com.ratemyspot.response.RecentPostResponse;
import com.ratemyspot.util.Result;
import org.springframework.data.domain.Page;

import java.util.List;

public interface PostService {

    /**
     * Get post feed with pagination.
     */
    Result<PageResult<PostResponse>> feed(PostFeedRequestDTO requestDTO);

    /**
     * Get post details.
     */
    Result<PostResponse> getPostDetail(Long id);

    /**
     * Create a new post.
     */
    Result<PostResponse> createPost(PostCreateDTO postCreateDTO);

    /**
     * Get posts by user ID.
     */
    Result<PageResult<PostResponse>> getUserPosts(Long userId, Integer page, Integer size);

    /**
     * Get recent posts for a spot.
     */
    Result<List<RecentPostResponse>> getRecentPosts(Long spotId);

    /** Search posts by keyword (fuzzy match on title or content). */
    Result<PageResult<PostResponse>> searchPosts(String keyword, Integer page, Integer size);
}