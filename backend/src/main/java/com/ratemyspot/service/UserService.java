package com.ratemyspot.service;

import com.ratemyspot.dto.UserDTO;
import com.ratemyspot.dto.UserLoginDTO;
import com.ratemyspot.dto.UserRegisterDTO;
import com.ratemyspot.entity.User;
import com.ratemyspot.response.PageResult;
import com.ratemyspot.response.UserProfileResponse;
import com.ratemyspot.response.UserSearchResponse;
import com.ratemyspot.util.Result;

import java.util.Map;

public interface UserService {
    /**
     * Send email verification code.
     * The type parameter determines the usage: 0 for registration, 1 for password reset.
     *
     * @param email The target email address
     * @param type  0: Register, 1: Forgot Password
     * @return Result with success message or error
     */
    Result<String> sendVerificationCode(String email, Integer type);

    /**
     * Register a new user.
     * Requires valid email, password, and verification code.
     *
     * @param registerDTO Data containing email, password, and verification code
     * @return Result containing the created UserDTO
     */
    Result<UserDTO> register(UserRegisterDTO registerDTO);

    /**
     * User login.
     * Validates credentials and returns a JWT token.
     *
     * @param loginDTO Login credentials (email and password)
     * @return Result containing a Map with "token" and "user" info
     */
    Result<Map<String, Object>> login(UserLoginDTO loginDTO);

    /**
     * Get the information of the currently logged-in user.
     * The user ID is retrieved from the UserContext.
     *
     * @return Result containing the current UserDTO
     */
    Result<UserDTO> getCurrentUserInfo();

    /**
     * Update user profile information.
     * Supports partial updates (nickname, icon, intro, etc.).
     *
     * @param user The user entity with updated fields
     * @return Result containing the updated UserDTO
     */
    Result<UserDTO> updateUserInfo(User user);

    /**
     * Update the password for the current user.
     * Requires a valid email verification code to authorize the change.
     *
     * @param newPassword The new password string
     * @param code        The email verification code
     * @return Result with success message
     */
    Result<String> updatePassword(String newPassword, String code);

    /**
     * Reset password using email and verification code.
     * Used when the user has forgotten their password.
     *
     * @param resetDTO Data containing email, code, and new password
     * @return Result with success message
     */
    Result<String> resetPassword(UserRegisterDTO resetDTO);

    /**
     * Log out the current user.
     *
     * @return Result with success message
     */
    Result<String> logout();

    /**
     * Get the public profile information of the target user.
     *
     * @param targetUserId The ID of the user whose profile is to be retrieved
     * @return Result containing the UserProfileResponse
     */
    Result<UserProfileResponse> getUserProfile(Long targetUserId);

    /** Search users by nickname (fuzzy match) with pagination. */
    Result<PageResult<UserSearchResponse>> searchUsers(String keyword, Integer page, Integer size);
}