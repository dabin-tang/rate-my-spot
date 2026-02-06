package com.ratemyspot.service;

import com.ratemyspot.dto.PostCreateDTO;
import com.ratemyspot.dto.PostFeedRequestDTO;
import com.ratemyspot.response.PostResponse;
import com.ratemyspot.util.Result;
import org.springframework.data.domain.Page;

public interface PostService {

    /**
     * Get post feed with pagination.
     */
    Result<Page<PostResponse>> feed(PostFeedRequestDTO requestDTO);

    /**
     * Get post details.
     */
    Result<PostResponse> getDetail(Long id);

    /**
     * Create a new post.
     */
    Result<PostResponse> create(PostCreateDTO postCreateDTO);
}