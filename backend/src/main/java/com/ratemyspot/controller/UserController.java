package com.ratemyspot.controller;

import com.ratemyspot.dto.UserDTO;
import com.ratemyspot.dto.UserLoginDTO;
import com.ratemyspot.dto.UserRegisterDTO;
import com.ratemyspot.entity.User;
import com.ratemyspot.service.UserService;
import com.ratemyspot.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@Tag(name = "User Controller", description = "User account and profile APIs")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    /**
     * Send email verification code.
     * The type parameter determines the usage: 0 for registration, 1 for password reset.
     */
    @Operation(summary = "Send Email Verification Code")
    @PostMapping("/send-code")
    public Result<String> sendCode(@RequestParam String email, @RequestParam Integer type) {
        // Just forward the request to the service
        return userService.sendVerificationCode(email, type);
    }

    /**
     * Register a new user account.
     * Requires email, password, and verification code.
     */
    @Operation(summary = "Register New User")
    @PostMapping("/register")
    public Result<UserDTO> register(@RequestBody @Valid UserRegisterDTO registerDTO) {
        // Service now returns Result<UserDTO>, so we return it directly
        return userService.register(registerDTO);
    }

    /**
     * User login.
     * Returns a JWT token and basic user information upon success.
     *
     * @param loginDTO Login credentials
     * @return Map containing "token" and "user" object
     */
    @Operation(summary = "User Login")
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody @Valid UserLoginDTO loginDTO) {
        return userService.login(loginDTO);
    }

    /**
     * Get information of the currently logged-in user.
     */
    @Operation(summary = "Get Current User Info")
    @GetMapping("/current")
    public Result<UserDTO> getCurrentUser() {
        return userService.getCurrentUserInfo();
    }

    /**
     * Update user profile information.
     * Allows updating fields like nickname, avatar, gender, city, etc.
     */
    @Operation(summary = "Update User Profile")
    @PutMapping("/update")
    public Result<UserDTO> updateProfile(@RequestBody User user) {
        return userService.updateUserInfo(user);
    }

    /**
     * Update the password for the logged-in user.
     */
    @Operation(summary = "Update Password (Logged In)")
    @PutMapping("/update-password")
    public Result<String> updatePassword(@RequestParam String newPassword) {
        return userService.updatePassword(newPassword);
    }

    /**
     * Reset password for a forgotten account.
     * Requires the email, the verification code, and the new password.
     */
    @Operation(summary = "Reset Password (Forgot Password)")
    @PostMapping("/reset-password")
    public Result<String> resetPassword(@RequestBody @Valid UserRegisterDTO resetDTO) {
        return userService.resetPassword(resetDTO);
    }

    /**
     * Log out the current user.
     */
    @Operation(summary = "Logout")
    @PostMapping("/logout")
    public Result<String> logout() {
        return userService.logout();
    }
}