package com.ratemyspot.controller;

import com.ratemyspot.dto.PostCreateDTO;
import com.ratemyspot.dto.PostFeedRequestDTO;
import com.ratemyspot.response.PostResponse;
import com.ratemyspot.service.PostService;
import com.ratemyspot.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public Result<Page<PostResponse>> feed(@ParameterObject @Valid PostFeedRequestDTO dto) {
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
    public Result<PostResponse> create(@RequestBody @Valid PostCreateDTO dto) {
        return postService.create(dto);
    }

    /**
     * Get post details.
     *
     * @param id post ID
     * @return post response
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get Post Detail", description = "Get detailed information of a post including user interaction status")
    public Result<PostResponse> getDetail(@PathVariable Long id) {
        return postService.getDetail(id);
    }

}