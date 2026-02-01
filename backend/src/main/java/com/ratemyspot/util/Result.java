package com.ratemyspot.util;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "Result", description = "Unified API response wrapper")
public class Result<T> {

    @Schema(description = "Indicates if the request was successful", example = "true")
    private Boolean success;

    @Schema(description = "Error message if request failed", example = "Invalid parameters")
    private String errorMsg;

    @Schema(description = "Returned data payload", example = "{ \"id\": 1, \"name\": \"John\" }")
    private T data;

    @Schema(description = "Total number of items for paginated responses", example = "100")
    private Long total;

    public static <T> Result<T> ok() {
        return new Result<>(true, null, null, null);
    }

    public static <T> Result<T> ok(T data) {
        return new Result<>(true, null, data, null);
    }

    public static <T> Result<T> ok(T data, Long total) {
        return new Result<>(true, null, data, total);
    }

    public static <T> Result<T> fail(String errorMsg) {
        return new Result<>(false, errorMsg, null, null);
    }
}