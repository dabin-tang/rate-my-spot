package com.ratemyspot.service.impl;

import com.ratemyspot.entity.CommentLike;
import com.ratemyspot.exception.BusinessException;
import com.ratemyspot.repository.CommentLikeRepository;
import com.ratemyspot.repository.PostCommentRepository;
import com.ratemyspot.service.CommentLikeService;
import com.ratemyspot.util.Constants;
import com.ratemyspot.util.Result;
import com.ratemyspot.util.UserContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class CommentLikeServiceImpl implements CommentLikeService {

    private final CommentLikeRepository commentLikeRepository;
    private final PostCommentRepository postCommentRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * Toggle like status for a comment.
     * Mirrors PostLikeServiceImpl.toggle: Redis Set for state, DB for persistence.
     */
    @Override
    @Transactional
    public Result<Void> toggle(Long commentId) {
        Long userId = UserContext.getCurrentUserId();
        String likesKey = Constants.CACHE_COMMENT_LIKES_KEY + commentId;

        // Verify comment exists
        if (!postCommentRepository.existsById(commentId)) {
            throw new BusinessException(Constants.ERR_COMMENT_NOT_FOUND);
        }

        // Check like status from Redis Set
        Boolean isLiked = redisTemplate.opsForSet().isMember(likesKey, userId);

        if (Boolean.TRUE.equals(isLiked)) {
            // Unlike: remove from DB + decrement count
            commentLikeRepository.deleteByUserIdAndCommentId(userId, commentId);
            postCommentRepository.decrementLiked(commentId);
            redisTemplate.opsForSet().remove(likesKey, userId);
        } else {
            // Like: insert into DB + increment count
            CommentLike commentLike = new CommentLike();
            commentLike.setCommentId(commentId)
                    .setUserId(userId)
                    .setCreateTime(LocalDateTime.now());
            commentLikeRepository.save(commentLike);
            postCommentRepository.incrementLiked(commentId);
            redisTemplate.opsForSet().add(likesKey, userId);
        }

        return Result.ok();
    }
}
