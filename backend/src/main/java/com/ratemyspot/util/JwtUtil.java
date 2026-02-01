package com.ratemyspot.util;

import com.ratemyspot.dto.UserDTO;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private final SecretKey SECRET_KEY;

    @Value("${jwt.expiration-time:86400000}")
    private long expirationTime;

    // Constructor
    public JwtUtil(@Value("${jwt.secret:default-secret-key-must-be-very-long-for-security}") String secret) {
        String key = secret.length() < 32 ?
                String.format("%-32s", secret).replace(' ', '0') :
                secret.substring(0, 32);
        this.SECRET_KEY = Keys.hmacShaKeyFor(key.getBytes());
    }

    /**
     * Generate JWT token
     */
    public String generateToken(UserDTO user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId());
        claims.put("email", user.getEmail());
        claims.put("nickname", user.getNickname());
        claims.put("icon", user.getIcon());
        claims.put("role", "USER");

        return Jwts.builder()
                .claims(claims)
                .subject(String.valueOf(user.getId()))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SECRET_KEY, Jwts.SIG.HS256)
                .compact();
    }

    /**
     * Validate token
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(SECRET_KEY)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Extract UserDTO from token
     */
    public UserDTO getUserInfoFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        UserDTO user = new UserDTO();
        user.setId(claims.get("id", Long.class));
        user.setEmail(claims.get("email", String.class));
        user.setNickname(claims.get("nickname", String.class));
        user.setIcon(claims.get("icon", String.class));

        return user;
    }

    /**
     * Extract user ID
     */
    public Long getUserIdFromToken(String token) {
        String subject = Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
        return Long.parseLong(subject);
    }

    /**
     * Extract Role
     */
    public String getRoleFromToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(SECRET_KEY)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .get("role", String.class);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Generate Admin Token
     */
    public String generateAdminToken(Long adminId, String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", adminId);
        claims.put("username", username);
        claims.put("role", role);
        claims.put("type", "ADMIN");

        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SECRET_KEY, Jwts.SIG.HS256)
                .compact();
    }
}