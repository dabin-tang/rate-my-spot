package com.ratemyspot.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/post-like")
@Tag(name = "Post Like Controller", description = "Like/Unlike operations for posts")
@RequiredArgsConstructor
@Slf4j
public class PostLikeController {
}