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
     * Get list of posts liked by a target user.
     */
    Result<PageResult<PostResponse>> getLikedPosts(Long userId, Integer page, Integer size);

    /**
     * Set whether the current user's liked posts list is visible to others.
     *
     * @param isPrivate true = only self can see; false = public
     */
    Result<Void> setLikesPrivacy(Boolean isPrivate);
}