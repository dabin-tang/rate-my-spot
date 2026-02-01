package com.ratemyspot.util;

import com.ratemyspot.dto.UserDTO;

/**
 * ThreadLocal container to hold current user info for the duration of the request.
 */
public class UserContext {
    private static final ThreadLocal<UserDTO> USER_CONTEXT = new ThreadLocal<>();

    // Set current user to ThreadLocal
    public static void setUser(UserDTO user) {
        USER_CONTEXT.set(user);
    }

    // Get current user from ThreadLocal
    public static UserDTO getCurrentUser() {
        return USER_CONTEXT.get();
    }

    // Get current userId
    public static Long getCurrentUserId() {
        UserDTO user = USER_CONTEXT.get();
        return user != null ? user.getId() : null;
    }

    // Get current user email
    public static String getCurrentUserEmail() {
        UserDTO user = USER_CONTEXT.get();
        return user != null ? user.getEmail() : null;
    }

    // Clear context at the end of the request
    public static void clear() {
        USER_CONTEXT.remove();
    }
}