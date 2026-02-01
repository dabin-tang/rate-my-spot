package com.ratemyspot.exception;

import lombok.Getter;

/**
 * Custom exception for general business logic errors.
 * Example: "User already exists", "Inventory insufficient".
 */
@Getter
public class BusinessException extends RuntimeException {
    private final String message;

    public BusinessException(String message) {
        super(message);
        this.message = message;
    }
}