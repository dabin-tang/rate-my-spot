package com.ratemyspot.service.impl;

import com.ratemyspot.dto.PostCommentCreateDTO;
import com.ratemyspot.entity.PostComment;
import com.ratemyspot.exception.BusinessException;
import com.ratemyspot.repository.PostCommentRepository;
import com.ratemyspot.repository.UserRepository;
import com.ratemyspot.entity.User;
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
    private final UserRepository userRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * Get all comments for a post and assemble them into a Parent→Children tree structure.
     */
    public Result<List<PostCommentResponse>> getPostCommentTree(Long postId) {
        String cacheKey = Constants.CACHE_POST_COMMENTS_KEY + postId;
        List<PostCommentResponse> tree;

        // 1. Try Redis cache first
        Object cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            tree = (List<PostCommentResponse>) cached;
        } else {
            // 2. Cache miss, fetch all comments for this post from DB
            List<PostComment> allComments = postCommentRepository.findAllByPostIdOrderByCreateTimeAsc(postId);

            // 3. Build comment tree in memory (Parent → Children)
            tree = buildTree(allComments);

            // 4. Write assembled tree into Redis with TTL
            redisTemplate.opsForValue().set(cacheKey, tree, Constants.CACHE_POST_COMMENTS_TTL, TimeUnit.MINUTES);
        }

        // 5. Recursively populate isLiked status for the current user
        Long currentUserId = UserContext.getCurrentUserId();
        if (currentUserId != null) {
            populateIsLiked(tree, currentUserId);
        } else {
            clearIsLiked(tree);
        }

        return Result.ok(tree);
    }

    private void populateIsLiked(List<PostCommentResponse> list, Long userId) {
        if (list == null || list.isEmpty()) return;
        for (PostCommentResponse comment : list) {
            String likesKey = Constants.CACHE_COMMENT_LIKES_KEY + comment.getId();
            Boolean isLiked = redisTemplate.opsForSet().isMember(likesKey, userId);
            comment.setIsLiked(Boolean.TRUE.equals(isLiked));
            populateIsLiked(comment.getChildren(), userId);
        }
    }

    private void clearIsLiked(List<PostCommentResponse> list) {
        if (list == null || list.isEmpty()) return;
        for (PostCommentResponse comment : list) {
            comment.setIsLiked(false);
            clearIsLiked(comment.getChildren());
        }
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
        if (flatList.isEmpty()) return new ArrayList<>();

        // Batch fetch users (authors and replied-to users)
        List<Long> authorIds = flatList.stream().map(PostComment::getUserId).collect(Collectors.toList());
        List<Long> replyIds = flatList.stream().map(PostComment::getReplyToUserId).filter(id -> id != null && id > 0).collect(Collectors.toList());
        List<Long> allUserIds = new ArrayList<>(authorIds);
        allUserIds.addAll(replyIds);
        allUserIds = allUserIds.stream().distinct().collect(Collectors.toList());

        Map<Long, User> userMap = userRepository.findAllById(allUserIds).stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        // Convert all entities to VO nodes first
        Map<Long, PostCommentResponse> nodeMap = flatList.stream()
                .collect(Collectors.toMap(PostComment::getId, c -> {
                    PostCommentResponse r = new PostCommentResponse();
                    BeanUtils.copyProperties(c, r);
                    
                    User u = userMap.get(c.getUserId());
                    if (u != null) {
                        r.setUserNickname(u.getNickname());
                        r.setUserIcon(u.getIcon());
                    }

                    if (c.getReplyToUserId() != null && c.getReplyToUserId() > 0) {
                        User replyUser = userMap.get(c.getReplyToUserId());
                        if (replyUser != null) {
                            r.setReplyToUserNickname(replyUser.getNickname());
                        }
                    }
                    
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
