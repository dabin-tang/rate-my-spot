package com.ratemyspot.service;

import com.ratemyspot.dto.PostCommentCreateDTO;
import com.ratemyspot.response.PostCommentResponse;
import com.ratemyspot.util.Result;

import java.util.List;

public interface PostCommentService {

    /** Fetch the full comment tree for a given post. */
    Result<List<PostCommentResponse>> getPostCommentTree(Long postId);

    /** Create a comment and invalidate the comment tree cache for its post. */
    Result<PostCommentResponse> createPostComment(PostCommentCreateDTO dto);

    /** Delete a comment (and its children if it's a parent). Validates ownership first. */
    Result<Void> deleteComment(Long commentId);
}
