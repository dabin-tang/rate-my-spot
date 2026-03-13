package com.ratemyspot.util;

public class Constants {
    private Constants() {

    }

    // Redis Keys
    public static final String REDIS_VERIFY_CODE_PREFIX = "VERIFY_CODE:";
    
    // Spot Cache
    public static final String CACHE_SPOT_KEY = "cache:spot:";
    public static final Long CACHE_NULL_TTL = 2L; // Minutes
    public static final Long CACHE_SPOT_TTL = 30L; // Minutes
    public static final Long CACHE_SPOT_LOGICAL_EXPIRE = 20L; // Seconds
    public static final Long CACHE_SPOT_LOCK_WAIT = 0L; // Seconds
    public static final Long CACHE_SPOT_LOCK_LEASE = 10L; // Seconds
    public static final String CACHE_SPOT_REVIEW_KEY = "cache:spot:reviews:";

    // Post Cache
    public static final String CACHE_POST_KEY = "cache:post:";
    public static final Long CACHE_POST_TTL = 30L; // Minutes

    // Post Comment Tree Cache
    public static final String CACHE_POST_COMMENTS_KEY = "cache:post:comments:";
    public static final Long CACHE_POST_COMMENTS_TTL = 10L; // Minutes

    // Post Like Set Cache (Redis Set: members = userIds who liked the post)
    public static final String CACHE_POST_LIKES_KEY = "cache:post:likes:";

    // Follow Set Cache (Redis Set: members = followUserId that current user follows)
    public static final String CACHE_USER_FOLLOWING_KEY = "cache:user:following:";

    // Report Status
    public static final int REPORT_STATUS_PENDING  = 0;
    public static final int REPORT_STATUS_RESOLVED = 1; // Reported content deleted
    public static final int REPORT_STATUS_REJECTED = 2; // Report ignored

    // Email Config (Temporary, ideally in application.yml)
    public static final String EMAIL_FROM = "your-email@gmail.com";
    public static final String EMAIL_SUBJECT = "Rate My Spot Verification Code";

    // Success Messages
    public static final String MSG_CODE_SENT = "Verification code sent successfully";
    public static final String MSG_REGISTER_SUCCESS = "Registration successful";
    public static final String MSG_PASSWORD_UPDATED = "Password updated successfully";
    public static final String MSG_PASSWORD_RESET = "Password has been reset successfully";
    public static final String MSG_LOGOUT = "Logged out successfully";
    public static final String MSG_SPOT_DELETED = "Spot deleted successfully";
    public static final String MSG_USER_STATUS_UPDATED = "User status updated successfully";
    public static final String MSG_POST_DELETED = "Post deleted successfully";
    public static final String MSG_COMMENT_DELETED = "Comment deleted successfully";
    public static final String MSG_REVIEW_DELETED = "Review deleted successfully";
    public static final String MSG_REPORT_RESOLVED = "Report resolved successfully";

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
    public static final String ERR_CATEGORY_NOT_FOUND = "Spot category not found";
    public static final String ERR_POST_NOT_FOUND = "Post not found or unavailable";
    public static final String ERR_COMMENT_NOT_FOUND = "Comment not found";
    public static final String ERR_REVIEW_NOT_FOUND = "Review not found";
    public static final String ERR_REPORT_NOT_FOUND = "Report not found";
    public static final String ERR_INVALID_ACTION = "Invalid action type";
    public static final String ERR_COMMENT_NO_PERMISSION = "No permission to delete this comment";
    public static final String ERR_FOLLOW_SELF = "You cannot follow yourself";
}