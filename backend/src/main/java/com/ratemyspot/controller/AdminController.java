package com.ratemyspot.controller;

import com.ratemyspot.dto.AdminLoginDTO;
import com.ratemyspot.dto.AdminUserQueryDTO;
import com.ratemyspot.dto.SpotCategoryUpdateDTO;
import com.ratemyspot.dto.SpotCreateDTO;
import com.ratemyspot.entity.SpotCategory;
import com.ratemyspot.response.AdminCommentResponse;
import com.ratemyspot.response.AdminStatsResponse;
import com.ratemyspot.response.AdminUserResponse;
import com.ratemyspot.response.PageResult;
import com.ratemyspot.response.PostResponse;
import com.ratemyspot.response.SpotResponse;
import com.ratemyspot.response.SpotReviewResponse;
import com.ratemyspot.service.AdminService;
import com.ratemyspot.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin Controller", description = "Back-office management APIs")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AdminService adminService;

    /**
     * Admin login.
     * Validates username and password, returns JWT token and admin summary on success.
     *
     * @param loginDTO Object containing username and password
     * @return Map containing "token", "id", "username", "role"
     */
    @PostMapping("/login")
    @Operation(summary = "Admin Login")
    public Result<Map<String, Object>> login(@RequestBody @Valid AdminLoginDTO loginDTO) {
        log.info("Admin Login request for username: {}", loginDTO.getUsername());
        return adminService.login(loginDTO);
    }

    /**
     * Admin logout.
     *
     * @return Result with success message
     */
    @PostMapping("/logout")
    @Operation(summary = "Admin Logout")
    public Result<String> logout() {
        log.info("Admin Logout");
        return adminService.logout();
    }

    /**
     * Get system-wide statistics for the admin dashboard.
     *
     * @return Result containing AdminStatsResponse with total users, posts, today's posts and spots
     */
    @GetMapping("/stats")
    @Operation(summary = "Get System Statistics")
    public Result<AdminStatsResponse> getStats() {
        return adminService.getStats();
    }

    /**
     * Get paginated user list for admin management.
     *
     * DTO supports pagination and optional filters by nickname and email.
     * @return Paginated list of AdminUserResponse
     */
    @GetMapping("/user/list")
    @Operation(summary = "Get User List (Admin)")
    public Result<PageResult<AdminUserResponse>> getUserList(@ModelAttribute AdminUserQueryDTO query) {
        return adminService.getUserList(query);
    }

    /**
     * Update the status of a user account.
     * Use status 0 to unban, 1 to ban.
     *
     * @param id     Target user ID
     * @param status New status (0: Active, 1: Banned)
     * @return Result with success message
     */
    @PutMapping("/user/{id}/status")
    @Operation(summary = "Update User Status (Ban/Unban)")
    public Result<String> updateUserStatus(
            @Parameter(description = "Target user ID", required = true)
            @PathVariable("id") Long id,
            @RequestParam Integer status) {
        log.info("Admin update user status: userId={}, status={}", id, status);
        return adminService.updateUserStatus(id, status);
    }

    /**
     * Get paginated spot list for admin management.
     *
     * @param categoryId Optional category filter
     * @param page       Page number, starts from 1 (default: 1)
     * @param size       Page size (default: 10)
     * @return Paginated list of SpotResponse
     */
    @GetMapping("/spot/list")
    @Operation(summary = "Get Spot List (Admin)")
    public Result<PageResult<SpotResponse>> getSpotList(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        return adminService.getSpotList(categoryId, page, size);
    }

    /**
     * Create a new spot.
     *
     * @param dto Spot creation request body (name, categoryId, description, address, images, x, y)
     * @return Result containing the created SpotResponse
     */
    @PostMapping("/spot/create")
    @Operation(summary = "Create New Spot (Admin)")
    public Result<SpotResponse> createSpot(@RequestBody @Valid SpotCreateDTO dto) {
        log.info("Admin create spot: {}", dto.getName());
        return adminService.createSpot(dto);
    }

    /**
     * Update an existing spot's information.
     *
     * @param id  Target spot ID
     * @param dto Updated spot data (name, categoryId, description, address, images, x, y)
     * @return Result containing the updated SpotResponse
     */
    @PutMapping("/spot/{id}")
    @Operation(summary = "Update Spot Info (Admin)")
    public Result<SpotResponse> updateSpot(
            @Parameter(description = "Target spot ID", required = true)
            @PathVariable("id") Long id,
            @RequestBody @Valid SpotCreateDTO dto) {
        log.info("Admin update spot: id={}", id);
        return adminService.updateSpot(id, dto);
    }

    /**
     * Delete a spot by ID.
     *
     * @param id Target spot ID
     * @return Result with success message
     */
    @DeleteMapping("/spot/{id}")
    @Operation(summary = "Delete Spot (Admin)")
    public Result<String> deleteSpot(
            @Parameter(description = "Target spot ID", required = true)
            @PathVariable("id") Long id) {
        log.info("Admin delete spot: id={}", id);
        return adminService.deleteSpot(id);
    }

    /**
     * Get all spot categories ordered by sort field.
     *
     * @return Result containing list of SpotCategory
     */
    @GetMapping("/spot-category/list")
    @Operation(summary = "Get All Spot Categories (Admin)")
    public Result<List<SpotCategory>> getSpotCategoryList() {
        return adminService.getSpotCategoryList();
    }

    /**
     * Update an existing spot category.
     *
     * @param id  Target category ID
     * @param dto Fields to update: name, icon, sort
     * @return Result containing the updated SpotCategory
     */
    @PutMapping("/spot-category/{id}")
    @Operation(summary = "Update Spot Category (Admin)")
    public Result<SpotCategory> updateSpotCategory(
            @Parameter(description = "Target category ID", required = true)
            @PathVariable("id") Long id,
            @RequestBody SpotCategoryUpdateDTO dto) {
        log.info("Admin update spot category: id={}", id);
        return adminService.updateSpotCategory(id, dto);
    }

    /**
     * Get paginated post list for admin review.
     * Returns all posts regardless of status, ordered by create time DESC.
     *
     * @param page Page number, starts from 1 (default: 1)
     * @param size Page size (default: 10)
     * @return Paginated list of PostResponse
     */
    @GetMapping("/post/list")
    @Operation(summary = "Get Post List (Admin)")
    public Result<PageResult<PostResponse>> getPostList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        return adminService.getPostList(page, size);
    }

    /**
     * Force delete a post that violates community guidelines.
     *
     * @param id Target post ID
     * @return Result with success or failure message
     */
    @DeleteMapping("/post/{id}")
    @Operation(summary = "Force Delete Post (Admin)")
    public Result<String> deletePost(
            @Parameter(description = "Target post ID", required = true)
            @PathVariable("id") Long id) {
        log.info("Admin force delete post: id={}", id);
        return adminService.deletePost(id);
    }

    /**
     * Get paginated comment list for admin content review.
     *
     * @param postId  Optional post ID to filter comments under a specific post
     * @param keyword Optional keyword to fuzzy search comment content
     * @param page    Page number, starts from 1 (default: 1)
     * @param size    Page size (default: 10)
     * @return Paginated list of AdminCommentResponse
     */
    @GetMapping("/post-comment/list")
    @Operation(summary = "Get Comment List (Admin)")
    public Result<PageResult<AdminCommentResponse>> getCommentList(
            @RequestParam(required = false) Long postId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        return adminService.getCommentList(postId, keyword, page, size);
    }

    /**
     * Force delete a comment and all its child replies.
     *
     * @param id Target comment ID
     * @return Result with success or failure message
     */
    @DeleteMapping("/post-comment/{id}")
    @Operation(summary = "Force Delete Comment (Admin)")
    public Result<String> deleteComment(
            @Parameter(description = "Target comment ID", required = true)
            @PathVariable("id") Long id) {
        log.info("Admin force delete comment: id={}", id);
        return adminService.deleteComment(id);
    }

    /**
     * Get paginated spot review list for admin content review.
     *
     * @param spotReviewId Optional review ID filter
     * @param page         Page number, starts from 1 (default: 1)
     * @param size         Page size (default: 10)
     * @return Paginated list of SpotReviewResponse
     */
    @GetMapping("/spot-review/list")
    @Operation(summary = "Get Spot Review List (Admin)")
    public Result<PageResult<SpotReviewResponse>> getSpotReviewList(
            @RequestParam(required = false) Long spotReviewId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        return adminService.getSpotReviewList(spotReviewId, page, size);
    }
}
