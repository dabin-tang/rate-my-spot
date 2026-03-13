package com.ratemyspot.service;

import com.ratemyspot.dto.AdminLoginDTO;
import com.ratemyspot.dto.AdminUserQueryDTO;
import com.ratemyspot.dto.ResolveReportDTO;
import com.ratemyspot.dto.SpotCategoryUpdateDTO;
import com.ratemyspot.dto.SpotCreateDTO;
import com.ratemyspot.entity.SpotCategory;
import com.ratemyspot.entity.Report;
import com.ratemyspot.response.AdminCommentResponse;
import com.ratemyspot.response.AdminStatsResponse;
import com.ratemyspot.response.AdminUserResponse;
import com.ratemyspot.response.PageResult;
import com.ratemyspot.response.PostResponse;
import com.ratemyspot.response.SpotResponse;
import com.ratemyspot.response.SpotReviewResponse;
import com.ratemyspot.util.Result;

import java.util.List;
import java.util.Map;

public interface AdminService {

    /** Admin login: validate credentials and return token + admin info. */
    Result<Map<String, Object>> login(AdminLoginDTO loginDTO);

    /** Admin logout. */
    Result<String> logout();

    /** Get system-wide statistics. */
    Result<AdminStatsResponse> getStats();

    /** Get paginated user list with optional nickname/email filters. */
    Result<PageResult<AdminUserResponse>> getUserList(AdminUserQueryDTO query);

    /** Update the status of a specified user (e.g., ban or unban). */
    Result<String> updateUserStatus(Long userId, Integer status);

    /** Get paginated spot list with optional categoryId filter. */
    Result<PageResult<SpotResponse>> getSpotList(Long categoryId, Integer page, Integer size);

    /** Create a new spot. */
    Result<SpotResponse> createSpot(SpotCreateDTO dto);

    /** Update an existing spot by ID. */
    Result<SpotResponse> updateSpot(Long spotId, SpotCreateDTO dto);

    /** Delete a spot by ID. */
    Result<String> deleteSpot(Long spotId);

    /** Get all spot categories ordered by sort field. */
    Result<List<SpotCategory>> getSpotCategoryList();

    /** Update an existing spot category by ID. */
    Result<SpotCategory> updateSpotCategory(Long categoryId, SpotCategoryUpdateDTO dto);

    /** Get paginated post list for admin review (all statuses). */
    Result<PageResult<PostResponse>> getPostList(Integer page, Integer size);

    /** Force delete a post by ID. */
    Result<String> deletePost(Long postId);

    /** Get paginated comment list with optional postId and keyword filters. */
    Result<PageResult<AdminCommentResponse>> getCommentList(Long postId, String keyword, Integer page, Integer size);

    /** Force delete a comment (and its child replies) by ID. */
    Result<String> deleteComment(Long commentId);

    /** Get paginated spot review list for admin review (optional spotReviewId filter). */
    Result<PageResult<SpotReviewResponse>> getSpotReviewList(Long spotReviewId, Integer page, Integer size);

    /** Force delete a spot review by ID. */
    Result<String> deleteSpotReview(Long reviewId);

    /** Get paginated report list with optional status filter. */
    Result<PageResult<Report>> getReportList(Integer status, Integer page, Integer size);

    /** Resolve a report ticket: execute action and update status + remark. */
    Result<String> resolveReport(Long reportId, ResolveReportDTO dto);
}