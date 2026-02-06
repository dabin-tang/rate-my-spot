package com.ratemyspot.util;

public class Constants {
    private Constants() {

    }

    // Redis Keys
    public static final String REDIS_VERIFY_CODE_PREFIX = "VERIFY_CODE:";
    
    // Spot Cache
    public static final String CACHE_SPOT_KEY = "cache:spot:";
    public static final Long CACHE_NULL_TTL = 2L; // Minutes
    public static final Long CACHE_SPOT_LOGICAL_EXPIRE = 20L; // Seconds
    public static final Long CACHE_SPOT_LOCK_WAIT = 0L; // Seconds
    public static final Long CACHE_SPOT_LOCK_LEASE = 10L; // Seconds

    // Post Cache
    public static final String CACHE_POST_KEY = "cache:post:";
    public static final Long CACHE_POST_TTL = 30L; // Minutes

    // Email Config (Temporary, ideally in application.yml)
    public static final String EMAIL_FROM = "your-email@gmail.com";
    public static final String EMAIL_SUBJECT = "Rate My Spot Verification Code";

    // Success Messages
    public static final String MSG_CODE_SENT = "Verification code sent successfully";
    public static final String MSG_REGISTER_SUCCESS = "Registration successful";
    public static final String MSG_PASSWORD_UPDATED = "Password updated successfully";
    public static final String MSG_PASSWORD_RESET = "Password has been reset successfully";
    public static final String MSG_LOGOUT = "Logged out successfully";

    // Error Messages
    public static final String ERR_EMAIL_EXISTS = "Email is already registered";
    public static final String ERR_EMAIL_NOT_REGISTERED = "Email is not registered";
    public static final String ERR_SEND_EMAIL_FAIL = "Failed to send email, please try again later";
    public static final String ERR_CODE_INVALID = "Invalid or expired verification code";
    public static final String ERR_LOGIN_FAIL = "Email or password incorrect";
    public static final String ERR_ACCOUNT_BANNED = "Account is banned";
    public static final String ERR_USER_NOT_LOGIN = "User not logged in";
    public static final String ERR_USER_NOT_FOUND = "User not found";
    public static final String ERR_SPOT_NOT_FOUND = "Spot not found";
    public static final String ERR_POST_NOT_FOUND = "Post not found or unavailable";
}