package com.ratemyspot.controller;

import com.ratemyspot.response.SpotResponse;
import com.ratemyspot.service.SpotService;
import com.ratemyspot.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/spot")
@Tag(name = "Spot Controller", description = "Spot (Location) retrieval and search APIs")
@RequiredArgsConstructor
@Slf4j
public class SpotController {

    private final SpotService spotService;

    /**
     * Get a paginated list of spots with optional filtering and sorting.
     *
     * @param categoryId Optional category ID filter
     * @param sort       Sort strategy: "distance", "score", or null (default)
     * @param latitude   User's current latitude (required)
     * @param longitude  User's current longitude (required)
     * @param page       Page number (1-indexed, default 1)
     * @return Result containing Page of SpotResponse
     */
    @GetMapping("/list")
    @Operation(summary = "Get Spot List", description = "Get list of spots with optional filtering and sorting.")
    public Result<Page<SpotResponse>> getSpotList(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String sort,
            @RequestParam @NotNull(message = "Latitude is required") Double latitude,
            @RequestParam @NotNull(message = "Longitude is required") Double longitude,
            @RequestParam(defaultValue = "1") Integer page) {

        log.info("Get Spot List: categoryId={}, sort={}, latitude={}, longitude={}, page={}",
                categoryId, sort, latitude, longitude, page);
        return spotService.getSpotList(categoryId, sort, latitude, longitude, page);
    }

    /**
     * Search for spots by keyword (matches name or description).
     *
     * @param keyword Search keyword
     * @return Result containing List of SpotResponse
     */
    @GetMapping("/search")
    @Operation(summary = "Search Spots", description = "Search spots by keyword (name or description).")
    public Result<List<SpotResponse>> search(@RequestParam String keyword) {
        log.info("Searching spots with keyword: {}", keyword);
        return spotService.search(keyword);
    }

    /**
     * Get spot details by ID.
     *
     * @param id Spot ID
     * @return Result containing SpotResponse
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get Spot Detail", description = "Get detailed information of a specific spot by ID.")
    public Result<SpotResponse> getSpotDetail(@PathVariable Long id) {
        log.info("Get Spot Detail: {}", id);
        return spotService.getSpotDetail(id);
    }
}