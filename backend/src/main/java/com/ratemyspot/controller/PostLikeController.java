package com.ratemyspot.controller;

import com.ratemyspot.response.PageResult;
import com.ratemyspot.response.PostResponse;
import com.ratemyspot.service.PostLikeService;
import com.ratemyspot.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/post-like")
@Tag(name = "Post Like Interface", description = "Like/Unlike operations for posts")
@RequiredArgsConstructor
@Slf4j
public class PostLikeController {

    private final PostLikeService postLikeService;

    /**
     * Toggle like status for a post.
     * 
     * @param postId The ID of the post to like/unlike
     * @return Void result
     */
    @Operation(summary = "Toggle Like Status")
    @PostMapping("/toggle")
    public Result<Void> toggle(@RequestParam Long postId) {
        log.info("Toggle Like Status: postId={}", postId);
        return postLikeService.toggle(postId);
    }

    /**
     * Get list of posts liked by current user.
     *
     * @param page Page number (default 1)
     * @param size Page size (default 10)
     * @return Page of liked posts
     */
    @Operation(summary = "Get Liked Posts")
    @GetMapping("/list")
    public Result<PageResult<PostResponse>> getLikedPosts(
            @RequestParam(required = false) Long userId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Long targetUserId = userId != null ? userId : com.ratemyspot.util.UserContext.getCurrentUserId();
        log.info("Get Liked Posts: targetUserId={}, page={}, size={}", targetUserId, page, size);
        return postLikeService.getLikedPosts(targetUserId, page, size);
    }

    /**
     * Set privacy for the current user's liked posts list.
     *
     * @param isPrivate true = private (only self can see), false = public
     * @return empty success result
     */
    @Operation(summary = "Set Likes Privacy", description = "Control whether other users can view your liked posts")
    @PutMapping("/privacy")
    public Result<Void> setLikesPrivacy(@RequestParam Boolean isPrivate) {
        log.info("Set likes privacy: isPrivate={}", isPrivate);
        return postLikeService.setLikesPrivacy(isPrivate);
    }
}