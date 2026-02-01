package com.ratemyspot.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/spot-category")
@Tag(name = "Spot Category Controller", description = "Spot category management APIs")
@RequiredArgsConstructor
@Slf4j
public class SpotCategoryController {
}