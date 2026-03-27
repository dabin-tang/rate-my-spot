package com.ratemyspot.service.impl;

import com.ratemyspot.dto.UserDTO;
import com.ratemyspot.dto.UserLoginDTO;
import com.ratemyspot.dto.UserRegisterDTO;
import com.ratemyspot.entity.User;
import com.ratemyspot.exception.BusinessException;
import com.ratemyspot.repository.FollowRepository;
import com.ratemyspot.repository.UserRepository;
import com.ratemyspot.response.PageResult;
import com.ratemyspot.response.UserProfileResponse;
import com.ratemyspot.response.UserSearchResponse;
import com.ratemyspot.service.UserService;
import com.ratemyspot.util.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final JavaMailSender mailSender;
    private final StringRedisTemplate redisTemplate;
    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final RedisTemplate<String, Object> redisTemplateObj;
    private final JwtUtil jwtUtil;

    // Generate 6-digit code
    private String generateCode() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }

    @Override
    public Result<String> sendVerificationCode(String email, Integer type) {
        boolean emailExists = userRepository.existsByEmail(email);
        if (type == 0 && emailExists) {
            return Result.fail(Constants.ERR_EMAIL_EXISTS);
        }
        if (type == 1 && !emailExists) {
            return Result.fail(Constants.ERR_EMAIL_NOT_REGISTERED);
        }
        String code = generateCode();
        String redisKey = Constants.REDIS_VERIFY_CODE_PREFIX + email;
        redisTemplate.opsForValue().set(redisKey, code, 5, TimeUnit.MINUTES);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(Constants.EMAIL_FROM);
            message.setTo(email);
            message.setSubject(Constants.EMAIL_SUBJECT);
            message.setText("Your verification code is: " + code + "\nIt will expire in 5 minutes.");
            mailSender.send(message);

            log.info("Sent verification code {} to {}", code, email);
            return Result.ok(Constants.MSG_CODE_SENT);
        } catch (Exception e) {
            log.error("Failed to send email to {}", email, e);
            return Result.fail(Constants.ERR_SEND_EMAIL_FAIL);
        }
    }

    @Override
    @Transactional
    public Result<UserDTO> register(UserRegisterDTO registerDTO) {
        // Validate Code
        String redisKey = Constants.REDIS_VERIFY_CODE_PREFIX + registerDTO.getEmail();
        String cacheCode = redisTemplate.opsForValue().get(redisKey);
        if (cacheCode == null || !cacheCode.equals(registerDTO.getCode())) {
            return Result.fail(Constants.ERR_CODE_INVALID);
        }
        // Validate Email Uniqueness
        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            return Result.fail(Constants.ERR_EMAIL_EXISTS);
        }
        // Create User
        User user = new User();
        // Copy basic fields
        BeanUtils.copyProperties(registerDTO, user);
        LocalDateTime now = LocalDateTime.now();
        // initialization
        user.setPassword(PasswordUtil.hashPassword(registerDTO.getPassword()))
                .setNickname(registerDTO.getEmail().split("@")[0]) // Default nickname
                .setIcon("https://api.dicebear.com/7.x/avataaars/svg?seed=" + registerDTO.getEmail()) // Default icon
                .setStatus(0)       // Active
                .setCredit(0)       // Initial credit
                .setGender(0)       // Unknown gender
                .setCreateTime(now)
                .setUpdateTime(now);

        userRepository.save(user);
        // Clean up cache
        redisTemplate.delete(redisKey);
        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO);
        return Result.ok(userDTO);
    }

    @Override
    public Result<Map<String, Object>> login(UserLoginDTO loginDTO) {
        // Use .orElse(null) to handle user not found gracefully
        User user = userRepository.findByEmail(loginDTO.getEmail()).orElse(null);
        if (user == null || !PasswordUtil.checkPassword(loginDTO.getPassword(), user.getPassword())) {
            return Result.fail(Constants.ERR_LOGIN_FAIL);
        }
        if (user.getStatus() != null && user.getStatus() == 1) {
            return Result.fail(Constants.ERR_ACCOUNT_BANNED);
        }

        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO);
        String token = jwtUtil.generateToken(userDTO);
        // Return token and user info
        Map<String, Object> map = new HashMap<>();
        map.put("token", token);
        map.put("user", userDTO);
        return Result.ok(map);
    }

    @Override
    public Result<UserDTO> getCurrentUserInfo() {
        Long currentUserId = UserContext.getCurrentUserId();
        if (currentUserId == null) {
            return Result.fail(Constants.ERR_USER_NOT_LOGIN);
        }
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new BusinessException(Constants.ERR_USER_NOT_FOUND));
        
        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO);

        // Fetch User Likes Privacy from Redis
        String privacyKey = Constants.CACHE_USER_LIKES_PRIVACY_KEY + currentUserId;
        Object privacy = redisTemplateObj.opsForValue().get(privacyKey);
        userDTO.setLikesPrivate("1".equals(privacy));

        return Result.ok(userDTO);
    }

    @Override
    @Transactional
    public Result<UserDTO> updateUserInfo(User userUpdateInfo) {
        Long currentUserId = UserContext.getCurrentUserId();
        // Get existing user
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new BusinessException(Constants.ERR_USER_NOT_FOUND));
        // Partial Update: Check nulls before setting
        if (userUpdateInfo.getNickname() != null) {
            user.setNickname(userUpdateInfo.getNickname());
        }
        if (userUpdateInfo.getIcon() != null) {
            user.setIcon(userUpdateInfo.getIcon());
        }
        if (userUpdateInfo.getIntro() != null) {
            user.setIntro(userUpdateInfo.getIntro());
        }
        if (userUpdateInfo.getCity() != null) {
            user.setCity(userUpdateInfo.getCity());
        }
        if (userUpdateInfo.getGender() != null) {
            user.setGender(userUpdateInfo.getGender());
        }
        user.setUpdateTime(LocalDateTime.now());
        userRepository.save(user);
        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO);
        return Result.ok(userDTO);
    }

    @Override
    @Transactional
    public Result<String> updatePassword(String newPassword, String code) {
        Long currentUserId = UserContext.getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new BusinessException(Constants.ERR_USER_NOT_FOUND));

        // Validate verification code against the current user's email
        String redisKey = Constants.REDIS_VERIFY_CODE_PREFIX + user.getEmail();
        String cacheCode = redisTemplate.opsForValue().get(redisKey);
        if (cacheCode == null || !cacheCode.equals(code)) {
            return Result.fail(Constants.ERR_CODE_INVALID);
        }

        user.setPassword(PasswordUtil.hashPassword(newPassword))
                .setUpdateTime(LocalDateTime.now());
        userRepository.save(user);

        // Invalidate the code after successful use
        redisTemplate.delete(redisKey);
        return Result.ok(Constants.MSG_PASSWORD_UPDATED);
    }

    @Override
    @Transactional
    public Result<String> resetPassword(UserRegisterDTO resetDTO) {
        String redisKey = Constants.REDIS_VERIFY_CODE_PREFIX + resetDTO.getEmail();
        // Validate Code
        String cacheCode = redisTemplate.opsForValue().get(redisKey);
        if (cacheCode == null || !cacheCode.equals(resetDTO.getCode())) {
            return Result.fail(Constants.ERR_CODE_INVALID);
        }
        User user = userRepository.findByEmail(resetDTO.getEmail())
                .orElseThrow(() -> new BusinessException(Constants.ERR_USER_NOT_FOUND));
        user.setPassword(PasswordUtil.hashPassword(resetDTO.getPassword()))
                .setUpdateTime(LocalDateTime.now());
        // update password
        userRepository.save(user);
        // Clean up cache
        redisTemplate.delete(redisKey);
        return Result.ok(Constants.MSG_PASSWORD_RESET);
    }

    @Override
    public Result<String> logout() {
        return Result.ok(Constants.MSG_LOGOUT);
    }

    @Override
    public Result<UserProfileResponse> getUserProfile(Long targetUserId) {
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new BusinessException(Constants.ERR_USER_NOT_FOUND));

        UserProfileResponse response = new UserProfileResponse();
        BeanUtils.copyProperties(targetUser, response);

        // Fetch counts
        long followersCount = followRepository.countByFollowUserId(targetUserId);
        long followingCount = followRepository.countByUserId(targetUserId);
        response.setFollowersCount(followersCount);
        response.setFollowingCount(followingCount);

        // Check if current user is following the target user from Redis Set cache
        Long currentUserId = UserContext.getCurrentUserId();
        if (currentUserId != null) {
            String followingKey = Constants.CACHE_USER_FOLLOWING_KEY + currentUserId;
            Boolean isFollowing = redisTemplateObj.opsForSet().isMember(followingKey, targetUserId);
            response.setIsFollowing(Boolean.TRUE.equals(isFollowing));
        }

        // Fetch Target User Likes Privacy from Redis
        String privacyKey = Constants.CACHE_USER_LIKES_PRIVACY_KEY + targetUserId;
        Object privacy = redisTemplateObj.opsForValue().get(privacyKey);
        response.setLikesPrivate("1".equals(privacy));

        return Result.ok(response);
    }

    @Override
    public Result<PageResult<UserSearchResponse>> searchUsers(String keyword, Integer page, Integer size) {
        PageRequest pageable = PageRequest.of(page - 1, size);
        Page<UserSearchResponse> pageData = userRepository.searchByNickname(keyword, pageable);
        
        List<UserSearchResponse> content = pageData.getContent();
        
        // Fill isFollowing if current user is logged in
        Long currentUserId = UserContext.getCurrentUserId();
        if (currentUserId != null && !content.isEmpty()) {
            String followingKey = Constants.CACHE_USER_FOLLOWING_KEY + currentUserId;
            for (UserSearchResponse user : content) {
                Boolean isFollowing = redisTemplateObj.opsForSet().isMember(followingKey, user.getId());
                user.setIsFollowing(Boolean.TRUE.equals(isFollowing));
            }
        }

        PageResult<UserSearchResponse> result = new PageResult<>(
                page, size,
                pageData.getTotalElements(),
                pageData.getTotalPages(),
                content
        );
        return Result.ok(result);
    }
}