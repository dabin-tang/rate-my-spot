package com.ratemyspot.controller;

import com.ratemyspot.response.PageResult;
import com.ratemyspot.response.UserResponse;
import com.ratemyspot.service.FollowService;
import com.ratemyspot.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/follow")
@Tag(name = "Follow Controller", description = "User relationship (Follow/Unfollow) APIs")
@RequiredArgsConstructor
@Slf4j
public class FollowController {

    private final FollowService followService;

    /**
     * Toggle follow status for a target user.
     * If not following -> follow.
     * If already following -> unfollow.
     *
     * @param targetUserId The user to follow or unfollow
     * @return Empty success result
     */
    @PostMapping("/toggle")
    @Operation(summary = "Toggle Follow Status")
    public Result<Void> toggle(
            @Parameter(description = "Target user ID", required = true)
            @RequestParam Long targetUserId) {
        log.info("[Follow] Toggle follow: targetUserId={}", targetUserId);
        return followService.toggle(targetUserId);
    }

    /**
     * Get paginated list of followers for the currently logged-in user.
     *
     * @param pageNum  Page number, starts from 1 (default: 1)
     * @param pageSize Number of items per page (default: 10)
     * @return Paginated list of followers as UserResponse
     */
    @GetMapping("/followers")
    @Operation(summary = "Get Follower List")
    public Result<PageResult<UserResponse>> getFollowers(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return followService.getFollowers(pageNum, pageSize);
    }

    /**
     * Get paginated list of users the current logged-in user is following.
     *
     * @param pageNum  Page number, starts from 1 (default: 1)
     * @param pageSize Number of items per page (default: 10)
     * @return Paginated list of following users as UserResponse
     */
    @GetMapping("/following")
    @Operation(summary = "Get Following List")
    public Result<PageResult<UserResponse>> getFollowing(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return followService.getFollowing(pageNum, pageSize);
    }
}