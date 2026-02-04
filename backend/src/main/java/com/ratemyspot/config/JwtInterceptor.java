package com.ratemyspot.config;

import com.ratemyspot.dto.UserDTO;
import com.ratemyspot.util.JwtUtil;
import com.ratemyspot.util.UserContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class JwtInterceptor implements HandlerInterceptor {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private StringRedisTemplate redisTemplate;

    // These paths do not need login, just let them pass
    private static final String[] EXCLUDE_PATHS = {
            // 1. Login and register. Obviously need to let these through
            "/api/user/login",
            "/api/user/register",
            "/api/admin/login",

            // 2. Public stuff. Guests can see spots, posts, and reviews
            // But they cannot create posts or write comments (those need login)
            "/api/spot/list",
            "/api/spot/search",
            "/api/spot-category/list",
            "/api/post/feed",
            "/api/spot-review/list",  // Guests can read reviews
            "/api/post-comment/list", // Guests can read comments

            // 3. Documentation for testing
            "/doc.html",
            "/webjars/**",
            "/swagger-resources/**",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",

            // 4. Static files and error pages
            "/files/**",
            "/error"
    };

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String requestURI = request.getRequestURI();

        // Just let static files and websocket pass
        if (requestURI.startsWith("/files/") || requestURI.startsWith("/ws/")) {
            return true;
        }

        // Check the whitelist. If the path is in the list, skip the check
        for (String path : EXCLUDE_PATHS) {
            if (path.endsWith("/**")) {
                // Handle wildcard paths
                String prefix = path.substring(0, path.length() - 3);
                if (requestURI.startsWith(prefix)) {
                    return true;
                }
            } else {
                // Handle exact match
                if (requestURI.equals(path)) {
                    return true;
                }
            }
        }

        // 1. Get the token from the header
        String token = extractTokenFromRequest(request);
        if (token == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":401,\"msg\":\"Not logged in\"}");
            return false;
        }

        // 2. Check if the token is valid or expired
        if (!jwtUtil.validateToken(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":401,\"msg\":\"Token is invalid or expired\"}");
            return false;
        }

        // 3. Redis check. If the user is banned, kick them out immediately
        // We used String.valueOf because the ID is a Long
        String userId = String.valueOf(jwtUtil.getUserIdFromToken(token));
        String banKey = "BANNED:" + userId;
        if (Boolean.TRUE.equals(redisTemplate.hasKey(banKey))) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":401,\"msg\":\"You are banned\"}");
            return false;
        }

        // 4. Save user info to context so we can use it later in Service
        UserDTO userDTO = jwtUtil.getUserInfoFromToken(token);
        UserContext.setUser(userDTO);

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        // Clean up the thread local to avoid memory leaks
        UserContext.clear();
    }

    /**
     * Helper to get the token string from the "Authorization" header
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}