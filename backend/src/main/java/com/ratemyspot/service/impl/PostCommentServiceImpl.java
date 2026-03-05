package com.ratemyspot.service.impl;

import com.ratemyspot.dto.PostCommentCreateDTO;
import com.ratemyspot.entity.PostComment;
import com.ratemyspot.exception.BusinessException;
import com.ratemyspot.repository.PostCommentRepository;
import com.ratemyspot.response.PostCommentResponse;
import com.ratemyspot.service.PostCommentService;
import com.ratemyspot.util.Constants;
import com.ratemyspot.util.Result;
import com.ratemyspot.util.UserContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class PostCommentServiceImpl implements PostCommentService {

    private final PostCommentRepository postCommentRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * Get all comments for a post and assemble them into a Parent→Children tree structure.
     * @param postId
     * @return
     */
    @Override
    public Result<List<PostCommentResponse>> getPostCommentTree(Long postId) {
        String cacheKey = Constants.CACHE_POST_COMMENTS_KEY + postId;

        // 1. Try Redis cache first
        Object cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return Result.ok((List<PostCommentResponse>) cached);
        }

        // 2. Cache miss, fetch all comments for this post from DB
        List<PostComment> allComments = postCommentRepository.findAllByPostIdOrderByCreateTimeAsc(postId);

        // 3. Build comment tree in memory (Parent → Children)
        List<PostCommentResponse> tree = buildTree(allComments);

        // 4. Write assembled tree into Redis with TTL
        redisTemplate.opsForValue().set(cacheKey, tree, Constants.CACHE_POST_COMMENTS_TTL, TimeUnit.MINUTES);

        return Result.ok(tree);
    }

    @Override
    @Transactional
    public Result<PostCommentResponse> createPostComment(PostCommentCreateDTO dto) {
        PostComment comment = new PostComment();
        BeanUtils.copyProperties(dto, comment);
        comment.setCreateTime(LocalDateTime.now());
        comment.setLiked(0);

        PostComment saved = postCommentRepository.save(comment);

        // Delete cache so the next getPostCommentTree call rebuilds the tree
        String cacheKey = Constants.CACHE_POST_COMMENTS_KEY + saved.getPostId();
        redisTemplate.delete(cacheKey);

        PostCommentResponse response = new PostCommentResponse();
        BeanUtils.copyProperties(saved, response);
        return Result.ok(response);
    }

    /**
     * Assemble a flat comment list into a Parent→Children tree.
     */
    private List<PostCommentResponse> buildTree(List<PostComment> flatList) {
        // Convert all entities to VO nodes first
        Map<Long, PostCommentResponse> nodeMap = flatList.stream()
                .collect(Collectors.toMap(PostComment::getId, c -> {
                    PostCommentResponse r = new PostCommentResponse();
                    BeanUtils.copyProperties(c, r);
                    return r;
                }));

        // Return only the root because the VO already contains the full child data.
        List<PostCommentResponse> roots = new ArrayList<>();

        flatList.forEach(comment -> {
            Long parentId = comment.getParentId();
            // If no parentId or parentId=0, it's a root comment
            if (parentId == null || parentId == 0L) {
                // Root-level comment
                roots.add(nodeMap.get(comment.getId()));
            } else {
                // Get parent node
                PostCommentResponse parent = nodeMap.get(parentId);
                if (parent != null) {
                    // Parent exists, add current node to parent's children
                    parent.getChildren().add(nodeMap.get(comment.getId()));
                } else {
                    // parent deleted, treat as root
                    roots.add(nodeMap.get(comment.getId()));
                }
            }
        });

        return roots;
    }

    @Override
    @Transactional
    public Result<Void> deleteComment(Long commentId) {
        // Get comment, throw if not found
        PostComment comment = postCommentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(Constants.ERR_COMMENT_NOT_FOUND));

        // Permission check: only the author can delete
        Long currentUserId = UserContext.getCurrentUserId();
        if (!comment.getUserId().equals(currentUserId)) {
            throw new BusinessException(Constants.ERR_COMMENT_NO_PERMISSION);
        }

        // If it's a parent comment, delete all children first to avoid orphan data
        boolean isParent = comment.getParentId() == null || comment.getParentId() == 0L;
        if (isParent) {
            postCommentRepository.deleteAllByParentId(commentId);
        }

        // Delete the comment itself
        postCommentRepository.deleteById(commentId);

        // Delete the comment tree cache for this post
        String cacheKey = Constants.CACHE_POST_COMMENTS_KEY + comment.getPostId();
        redisTemplate.delete(cacheKey);

        return Result.ok();
    }

}
