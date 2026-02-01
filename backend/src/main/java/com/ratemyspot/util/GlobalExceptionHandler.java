package com.ratemyspot.util;


import com.ratemyspot.exception.BusinessException;
import com.ratemyspot.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLIntegrityConstraintViolationException;

/**
 * Global exception handler to capture system and business exceptions
 * and return a unified Result response.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle custom business exceptions.
     */
    @ExceptionHandler(BusinessException.class)
    public Result<?> handleBusinessException(BusinessException e) {
        log.warn("Business Exception: {}", e.getMessage());
        return Result.fail(e.getMessage());
    }

    /**
     * Handle resource not found exceptions.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public Result<?> handleResourceNotFoundException(ResourceNotFoundException e) {
        log.warn("Resource Not Found: {}", e.getMessage());
        return Result.fail(e.getMessage());
    }

    /**
     * Handle validation errors (e.g., @NotNull, @Size).
     * Returns the default message of the first field error.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<?> handleValidationExceptions(MethodArgumentNotValidException e) {
        String errorMessage = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .findFirst()
                .orElse("Validation error");

        log.warn("Validation Failed: {}", errorMessage);
        return Result.fail(errorMessage);
    }

    /**
     * Handle database integrity violations (e.g., duplicate unique keys).
     */
    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public Result<?> handleSQLIntegrityException(SQLIntegrityConstraintViolationException e) {
        log.error("Database Integrity Violation: {}", e.getMessage());
        return Result.fail("Duplicate data or constraint violation.");
    }

    /**
     * Handle general database access errors.
     */
    @ExceptionHandler(DataAccessException.class)
    public Result<?> handleDataAccessException(DataAccessException e) {
        log.error("Database Access Error: {}", e.getMessage(), e);
        return Result.fail("System database error, please try again later.");
    }

    /**
     * Handle illegal arguments.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public Result<?> handleIllegalArgumentException(IllegalArgumentException e) {
        log.warn("Illegal Argument: {}", e.getMessage());
        return Result.fail(e.getMessage());
    }

    /**
     * Handle all other uncaught exceptions.
     */
    @ExceptionHandler(Exception.class)
    public Result<?> handleException(Exception e) {
        log.error("Unknown System Exception: {}", e.getMessage(), e);
        return Result.fail("Internal server error, please contact administrator.");
    }
}