package com.ratemyspot.service;

import com.ratemyspot.response.PageResult;
import com.ratemyspot.response.PostResponse;
import com.ratemyspot.util.Result;

public interface PostLikeService {

    /**
     * Toggle like status for a post.
     * If not liked -> like (create record, post.liked + 1)
     * If liked -> unlike (delete record, post.liked - 1)
     */
    Result<Void> toggle(Long postId);

    /**
     * Get list of posts liked by current user.
     */
    Result<PageResult<PostResponse>> getLikedPosts(Integer page, Integer size);
}