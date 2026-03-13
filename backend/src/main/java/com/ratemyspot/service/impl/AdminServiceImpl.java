package com.ratemyspot.service.impl;

import com.ratemyspot.dto.AdminLoginDTO;
import com.ratemyspot.dto.AdminUserQueryDTO;
import com.ratemyspot.dto.SpotCategoryUpdateDTO;
import com.ratemyspot.dto.SpotCreateDTO;
import com.ratemyspot.entity.Admin;
import com.ratemyspot.entity.Spot;
import com.ratemyspot.entity.SpotCategory;
import com.ratemyspot.exception.BusinessException;
import com.ratemyspot.repository.AdminRepository;
import com.ratemyspot.repository.PostCommentRepository;
import com.ratemyspot.repository.PostRepository;
import com.ratemyspot.repository.SpotCategoryRepository;
import com.ratemyspot.repository.SpotRepository;
import com.ratemyspot.repository.SpotReviewRepository;
import com.ratemyspot.repository.UserRepository;
import com.ratemyspot.response.AdminCommentResponse;
import com.ratemyspot.response.AdminStatsResponse;
import com.ratemyspot.response.AdminUserResponse;
import com.ratemyspot.response.PageResult;
import com.ratemyspot.response.PostResponse;
import com.ratemyspot.response.SpotResponse;
import com.ratemyspot.response.SpotReviewResponse;
import com.ratemyspot.service.AdminService;
import com.ratemyspot.util.Constants;
import com.ratemyspot.util.JwtUtil;
import com.ratemyspot.util.PasswordUtil;
import com.ratemyspot.util.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

@Service
@Slf4j
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PostCommentRepository postCommentRepository;
    private final SpotRepository spotRepository;
    private final SpotCategoryRepository spotCategoryRepository;
    private final SpotReviewRepository spotReviewRepository;
    private final JwtUtil jwtUtil;

    /**
     * Admin login.
     */
    @Override
    public Result<Map<String, Object>> login(AdminLoginDTO loginDTO) {
        Admin admin = adminRepository.findByUsername(loginDTO.getUsername()).orElse(null);
        if (admin == null || !PasswordUtil.checkPassword(loginDTO.getPassword(), admin.getPassword())) {
            return Result.fail(Constants.ERR_LOGIN_FAIL);
        }
        String token = jwtUtil.generateAdminToken(admin.getId(), admin.getUsername(), admin.getRole());
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("id", admin.getId());
        data.put("username", admin.getUsername());
        data.put("role", admin.getRole());
        return Result.ok(data);
    }

    /**
     * Admin logout
     */
    @Override
    public Result<String> logout() {
        return Result.ok(Constants.MSG_LOGOUT);
    }

    @Override
    public Result<AdminStatsResponse> getStats() {
        // Count all registered users
        long totalUsers = userRepository.count();

        // Count all posts (including hidden/under review)
        long totalPosts = postRepository.count();

        // Count all registered spots
        long totalSpots = spotRepository.count();

        // Count posts created since today
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        long todayPosts = postRepository.countByCreateTimeAfter(todayStart);

        AdminStatsResponse stats = new AdminStatsResponse(
                totalUsers, totalPosts, todayPosts, totalSpots);
        return Result.ok(stats);
    }

    /**
     * Get paginated user list with optional nickname/email filters. Empty strings are treated as null (no filter).
     */
    @Override
    public Result<PageResult<AdminUserResponse>> getUserList(AdminUserQueryDTO query) {
        // Convert empty strings to null so JPQL treats them as "no filter"
        String nicknameFilter = (query.getNickname() == null || query.getNickname().isBlank()) ? null : query.getNickname();
        String emailFilter = (query.getEmail() == null || query.getEmail().isBlank()) ? null : query.getEmail();
        PageRequest pageable = PageRequest.of(query.getPage() - 1, query.getSize());
        Page<AdminUserResponse> pageData = userRepository.findAdminUserList(nicknameFilter, emailFilter, pageable);
        PageResult<AdminUserResponse> result = new PageResult<>(
                query.getPage(), query.getSize(),
                pageData.getTotalElements(),
                pageData.getTotalPages(),
                pageData.getContent()
        );
        return Result.ok(result);
    }

    /**
     * Update the status of a specified user (e.g., ban or unban). Status values: 0 = normal, 1 = banned.
     */
    @Override
    @Transactional
    public Result<String> updateUserStatus(Long userId, Integer status) {
        // Verify user exists before updating
        if (!userRepository.existsById(userId)) {
            return Result.fail(Constants.ERR_USER_NOT_FOUND);
        }
        userRepository.updateStatus(userId, status);
        return Result.ok(Constants.MSG_USER_STATUS_UPDATED);
    }

    /**
     * Get paginated spot list with optional categoryId filter.
     */
    @Override
    public Result<PageResult<SpotResponse>> getSpotList(Long categoryId, Integer page, Integer size) {
        PageRequest pageable = PageRequest.of(page - 1, size);
        // Reuse existing JPQL: categoryId=null means no filter
        Page<Spot> pageData = spotRepository.findByFilterDefault(categoryId, pageable);
        // Map Spot entities to SpotResponse VOs
        List<SpotResponse> list = pageData.getContent().stream().map(spot -> {
            SpotResponse vo = new SpotResponse();
            BeanUtils.copyProperties(spot, vo);
            return vo;
        }).toList();
        PageResult<SpotResponse> result = new PageResult<>(
                page, size,
                pageData.getTotalElements(),
                pageData.getTotalPages(),
                list
        );
        return Result.ok(result);
    }

    /**
     * Create a new spot.
     */
    @Override
    @Transactional
    public Result<SpotResponse> createSpot(SpotCreateDTO dto) {
        Spot spot = new Spot();
        BeanUtils.copyProperties(dto, spot);
        LocalDateTime now = LocalDateTime.now();
        // Set default values
        spot.setScore(0.0)
                .setReviewCount(0)
                .setCreateTime(now)
                .setUpdateTime(now);
        spotRepository.save(spot);
        SpotResponse vo = new SpotResponse();
        BeanUtils.copyProperties(spot, vo);
        return Result.ok(vo);
    }

    /**
     * Update an existing spot by ID.
     */
    @Override
    @Transactional
    public Result<SpotResponse> updateSpot(Long spotId, SpotCreateDTO dto) {
        // Ensure the target spot exists
        Spot spot = spotRepository.findById(spotId)
                .orElseThrow(() -> new BusinessException(Constants.ERR_SPOT_NOT_FOUND));
        BeanUtils.copyProperties(dto, spot);
        spot.setUpdateTime(LocalDateTime.now());
        spotRepository.save(spot);

        SpotResponse vo = new SpotResponse();
        BeanUtils.copyProperties(spot, vo);
        return Result.ok(vo);
    }

    /**
     * Delete a spot by ID.
     */
    @Override
    @Transactional
    public Result<String> deleteSpot(Long spotId) {
        // Ensure the target spot exists
        if (!spotRepository.existsById(spotId)) {
            return Result.fail(Constants.ERR_SPOT_NOT_FOUND);
        }
        spotRepository.deleteById(spotId);
        return Result.ok(Constants.MSG_SPOT_DELETED);
    }

    /**
     * Get all spot categories ordered by sort field.
     */
    @Override
    public Result<List<SpotCategory>> getSpotCategoryList() {
        List<SpotCategory> categories = spotCategoryRepository.findAllByOrderBySortAsc();
        return Result.ok(categories);
    }

    /**
     * Update an existing spot category by ID.
     */
    @Override
    @Transactional
    public Result<SpotCategory> updateSpotCategory(Long categoryId, SpotCategoryUpdateDTO dto) {
        // Ensure the target category exists
        SpotCategory category = spotCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new BusinessException(Constants.ERR_CATEGORY_NOT_FOUND));
        // Partial update: only overwrite non-null fields
        if (dto.getName() != null) {
            category.setName(dto.getName());
        }
        if (dto.getIcon() != null) {
            category.setIcon(dto.getIcon());
        }
        if (dto.getSort() != null) {
            category.setSort(dto.getSort());
        }
        category.setUpdateTime(LocalDateTime.now());
        spotCategoryRepository.save(category);
        return Result.ok(category);
    }

    /**
     * Get paginated post list for admin review (all statuses).
     */
    @Override
    public Result<PageResult<PostResponse>> getPostList(Integer page, Integer size) {
        PageRequest pageable = PageRequest.of(page - 1, size);
        Page<PostResponse> pageData = postRepository.findAllForAdmin(pageable);
        PageResult<PostResponse> result = new PageResult<>(
                page, size,
                pageData.getTotalElements(),
                pageData.getTotalPages(),
                pageData.getContent()
        );
        return Result.ok(result);
    }

    /**
     * Force delete a post by ID.
     */
    @Override
    @Transactional
    public Result<String> deletePost(Long postId) {
        // Verify that the post exists before deleting
        if (!postRepository.existsById(postId)) {
            return Result.fail(Constants.ERR_POST_NOT_FOUND);
        }
        postRepository.deleteById(postId);
        return Result.ok(Constants.MSG_POST_DELETED);
    }

    /**
     * Get paginated comment list with optional postId and keyword filters.
     */
    @Override
    public Result<PageResult<AdminCommentResponse>> getCommentList(Long postId, String keyword, Integer page, Integer size) {
        // Convert empty strings to null so JPQL treats them as no filter
        String keywordFilter = (keyword == null || keyword.isBlank()) ? null : keyword;
        PageRequest pageable = PageRequest.of(page - 1, size);
        Page<AdminCommentResponse> pageData = postCommentRepository.findAllForAdmin(postId, keywordFilter, pageable);
        PageResult<AdminCommentResponse> result = new PageResult<>(
                page, size,
                pageData.getTotalElements(),
                pageData.getTotalPages(),
                pageData.getContent()
        );
        return Result.ok(result);
    }

    /**
     * Force delete a comment and its child replies by ID.
     * Note: bypasses ownership check intentionally — admin has authority to delete any comment.
     */
    @Override
    @Transactional
    public Result<String> deleteComment(Long commentId) {
        if (!postCommentRepository.existsById(commentId)) {
            return Result.fail(Constants.ERR_COMMENT_NOT_FOUND);
        }
        // Delete child replies first to avoid orphan records
        postCommentRepository.deleteAllByParentId(commentId);
        postCommentRepository.deleteById(commentId);
        return Result.ok(Constants.MSG_COMMENT_DELETED);
    }

    /**
     * Get paginated spot review list for admin review.
     * Directly calls SpotReviewRepository to bypass user-level caching in SpotReviewService.
     */
    @Override
    public Result<PageResult<SpotReviewResponse>> getSpotReviewList(Long spotReviewId, Integer page, Integer size) {
        PageRequest pageable = PageRequest.of(page - 1, size);
        Page<SpotReviewResponse> pageData = spotReviewRepository.findAllForAdmin(spotReviewId, pageable);
        PageResult<SpotReviewResponse> result = new PageResult<>(
                page, size,
                pageData.getTotalElements(),
                pageData.getTotalPages(),
                pageData.getContent()
        );
        return Result.ok(result);
    }
}
