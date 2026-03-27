package com.ratemyspot.controller;

import com.ratemyspot.dto.PostCreateDTO;
import com.ratemyspot.dto.PostFeedRequestDTO;
import com.ratemyspot.response.PageResult;
import com.ratemyspot.response.PostResponse;
import com.ratemyspot.response.RecentPostResponse;
import com.ratemyspot.service.PostService;
import com.ratemyspot.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/post")
@Tag(name = "Post Controller", description = "Social feed and post management APIs")
@RequiredArgsConstructor
@Slf4j
public class PostController {

    private final PostService postService;

    /**
     * Get post feed with waterfall flow.
     * Supports filtering by category and sorting by latest/default.
     *
     * @param dto the feed query parameters
     * @return the page result of posts
     */
    @GetMapping("/feed")
    @Operation(summary = "Get Post Feed", description = "Waterfall flow for posts. Supports filtering by category and sorting.")
    public Result<PageResult<PostResponse>> feed(@ParameterObject @Valid PostFeedRequestDTO dto) {
        log.info("Get Post Feed: {}", dto);
        return postService.feed(dto);
    }

    /**
     * Create a new post for a specific spot.
     *
     * @param dto the post creation data
     * @return the created post response
     */
    @PostMapping("/create")
    @Operation(summary = "Create a new post", description = "Create a new post for a specific spot")
    public Result<PostResponse> createPost(@RequestBody @Valid PostCreateDTO dto) {
        log.info("Create Post: {}", dto);
        return postService.createPost(dto);
    }

    /**
     * Get post details.
     *
     * @param id post ID
     * @return post response
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get Post Detail", description = "Get detailed information of a post including user interaction status")
    public Result<PostResponse> getPostDetail(@PathVariable Long id) {
        log.info("Get Post Detail: {}", id);
        return postService.getPostDetail(id);
    }

    /**
     * Get posts by user ID.
     *
     * @param userId user ID
     * @param page   page number (default 1)
     * @param size   page size (default 10)
     * @return list of posts
     */
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get User Posts", description = "Get paginated list of posts created by a specific user")
    public Result<PageResult<PostResponse>> getUserPosts(@PathVariable Long userId,
                                                   @RequestParam(defaultValue = "1") Integer page,
                                                   @RequestParam(defaultValue = "10") Integer size) {
        log.info("Get User Posts: userId={}, page={}, size={}", userId, page, size);
        return postService.getUserPosts(userId, page, size);
    }

    /**
     * Get recent posts for a spot.
     *
     * @param spotId spot ID
     * @return list of recent posts
     */
    @GetMapping("/spot/{spotId}")
    @Operation(summary = "Get Recent Posts", description = "Get 2 most recent posts for a specific spot")
    public Result<List<RecentPostResponse>> getRecentPosts(@PathVariable Long spotId) {
        log.info("Get Recent Posts: spotId={}", spotId);
        return postService.getRecentPosts(spotId);
    }

    /**
     * Search posts by keyword (fuzzy match on title or content).
     *
     * @param keyword Required search keyword
     * @param page    Page number, starts from 1 (default: 1)
     * @param size    Page size (default: 10)
     * @return Paginated list of matching posts
     */
    @GetMapping("/search")
    @Operation(summary = "Search Posts", description = "Fuzzy search posts by title or content keyword")
    public Result<PageResult<PostResponse>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        log.info("Search Posts: keyword={}, page={}, size={}", keyword, page, size);
        return postService.searchPosts(keyword, page, size);
    }

    /**
     * Delete the current user's own post.
     * Only the author can delete their own post.
     *
     * @param id post ID to delete
     * @return success message
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Own Post", description = "Delete the current user's own post. Only the author is allowed.")
    public Result<String> deletePost(
            @io.swagger.v3.oas.annotations.Parameter(description = "Post ID", required = true)
            @PathVariable Long id) {
        log.info("Delete Post: id={}", id);
        return postService.deletePost(id);
    }
}