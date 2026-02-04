package com.ratemyspot.service.impl;

import com.ratemyspot.dto.UserDTO;
import com.ratemyspot.dto.UserLoginDTO;
import com.ratemyspot.dto.UserRegisterDTO;
import com.ratemyspot.entity.User;
import com.ratemyspot.exception.BusinessException;
import com.ratemyspot.repository.UserRepository;
import com.ratemyspot.service.UserService;
import com.ratemyspot.util.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
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
        if (userUpdateInfo.getNickname() != null) user.setNickname(userUpdateInfo.getNickname());
        if (userUpdateInfo.getIcon() != null) user.setIcon(userUpdateInfo.getIcon());
        if (userUpdateInfo.getIntro() != null) user.setIntro(userUpdateInfo.getIntro());
        if (userUpdateInfo.getCity() != null) user.setCity(userUpdateInfo.getCity());
        if (userUpdateInfo.getGender() != null) user.setGender(userUpdateInfo.getGender());
        user.setUpdateTime(LocalDateTime.now());
        userRepository.save(user);
        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO);
        return Result.ok(userDTO);
    }

    @Override
    @Transactional
    public Result<String> updatePassword(String newPassword) {
        Long currentUserId = UserContext.getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new BusinessException(Constants.ERR_USER_NOT_FOUND));
        user.setPassword(PasswordUtil.hashPassword(newPassword))
                .setUpdateTime(LocalDateTime.now());
        userRepository.save(user);
        return Result.ok(Constants.MSG_PASSWORD_UPDATED);
    }

    @Override
    @Transactional
    public Result<String> resetPassword(UserRegisterDTO resetDTO) {
        String redisKey = Constants.REDIS_VERIFY_CODE_PREFIX + resetDTO.getEmail();
        String cacheCode = redisTemplate.opsForValue().get(redisKey);
        if (cacheCode == null || !cacheCode.equals(resetDTO.getCode())) {
            return Result.fail(Constants.ERR_CODE_INVALID);
        }
        User user = userRepository.findByEmail(resetDTO.getEmail())
                .orElseThrow(() -> new BusinessException(Constants.ERR_USER_NOT_FOUND));
        user.setPassword(PasswordUtil.hashPassword(resetDTO.getPassword()))
                .setUpdateTime(LocalDateTime.now());
        userRepository.save(user);
        redisTemplate.delete(redisKey);
        return Result.ok(Constants.MSG_PASSWORD_RESET);
    }

    @Override
    public Result<String> logout() {
        return Result.ok(Constants.MSG_LOGOUT);
    }
}