package com.ratemyspot.controller;

import com.ratemyspot.response.SpotCategoryResponse;
import com.ratemyspot.service.SpotCategoryService;
import com.ratemyspot.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/spot-category")
@Tag(name = "Spot Category Controller", description = "Spot category management APIs")
@RequiredArgsConstructor
@Slf4j
public class SpotCategoryController {

    private final SpotCategoryService spotCategoryService;

    @Operation(summary = "Get all categories")
    @GetMapping("/list")
    public Result<List<SpotCategoryResponse>> list() {
        return spotCategoryService.getCategoryList();
    }
}