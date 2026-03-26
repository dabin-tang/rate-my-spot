package com.ratemyspot.service;

import com.ratemyspot.util.Result;

public interface CommentLikeService {

    /**
     * Toggle like status for a comment.
     * Like if not liked, unlike if already liked.
     *
     * @param commentId Target comment ID
     * @return empty success result
     */
    Result<Void> toggle(Long commentId);
}
