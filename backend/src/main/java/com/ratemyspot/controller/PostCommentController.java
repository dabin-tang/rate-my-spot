package com.ratemyspot.controller;

import com.ratemyspot.dto.PostCommentCreateDTO;
import com.ratemyspot.response.PostCommentResponse;
import com.ratemyspot.service.PostCommentService;
import com.ratemyspot.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/post-comment")
@Tag(name = "Post Comment Controller", description = "Comments and replies on posts")
@RequiredArgsConstructor
@Slf4j
public class PostCommentController {

    private final PostCommentService postCommentService;

    /**
     * Get the full comment tree for a post.
     *
     * @param postId Target post ID (required)
     * @return Nested comment tree
     */
    @GetMapping("/list")
    @Operation(summary = "Get comment tree by post ID")
    public Result<List<PostCommentResponse>> getPostCommentTree(
            @Parameter(description = "Target post ID", required = true)
            @RequestParam Long postId) {
        return postCommentService.getPostCommentTree(postId);
    }

    /**
     * Create a new comment and invalidate the comment tree cache for that post.
     *
     * @param dto Comment data from request body
     * @return Saved comment VO
     */
    @PostMapping("/create")
    @Operation(summary = "Create a comment")
    public Result<PostCommentResponse> createPostComment(@Valid @RequestBody PostCommentCreateDTO dto) {
        log.info("[PostComment] Create comment request: postId={}, userId={}", dto.getPostId(), dto.getUserId());
        return postCommentService.createPostComment(dto);
    }

    /**
     * Delete a comment (and its children if it's a parent).
     * Only the comment author can perform this action.
     *
     * @param id Comment ID to delete
     * @return empty success result
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a comment by ID")
    public Result<Void> deletePostComment(
            @Parameter(description = "Comment ID", required = true)
            @PathVariable Long id) {
        log.info("[PostComment] Delete comment request: id={}", id);
        return postCommentService.deleteComment(id);
    }
}
