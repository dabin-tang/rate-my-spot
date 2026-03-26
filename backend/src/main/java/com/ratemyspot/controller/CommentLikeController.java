package com.ratemyspot.controller;

import com.ratemyspot.service.CommentLikeService;
import com.ratemyspot.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comment-like")
@Tag(name = "Comment Like Controller", description = "Like management for post comments")
@RequiredArgsConstructor
@Slf4j
public class CommentLikeController {

    private final CommentLikeService commentLikeService;

    /**
     * Toggle like status for a comment.
     * Likes if not yet liked, unlikes if already liked.
     *
     * @param commentId Target comment ID
     * @return empty success result
     */
    @PostMapping("/toggle")
    @Operation(summary = "Toggle Comment Like", description = "Like or unlike a comment (toggle)")
    public Result<Void> toggle(
            @Parameter(description = "Target comment ID", required = true)
            @RequestParam Long commentId) {
        log.info("Toggle comment like: commentId={}", commentId);
        return commentLikeService.toggle(commentId);
    }
}
