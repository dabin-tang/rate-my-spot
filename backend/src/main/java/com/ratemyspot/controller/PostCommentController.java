package com.ratemyspot.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/post-comment")
@Tag(name = "Post Comment Controller", description = "Comments and replies on posts")
@RequiredArgsConstructor
@Slf4j
public class PostCommentController {
}