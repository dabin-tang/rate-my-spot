package com.ratemyspot.exception;

import lombok.Getter;

/**
 * Exception thrown when a requested resource is not found in the database.
 * Example: "Spot with ID 1001 not found".
 */
@Getter
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resourceName, Object id) {
        super(String.format("%s with ID %s not found", resourceName, id));
    }
}