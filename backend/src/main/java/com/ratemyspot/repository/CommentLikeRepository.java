package com.ratemyspot.repository;

import com.ratemyspot.entity.CommentLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {

    /** Delete the like record for a specific user and comment. */
    void deleteByUserIdAndCommentId(Long userId, Long commentId);

    /** Check if a like record exists for a specific user and comment. */
    boolean existsByUserIdAndCommentId(Long userId, Long commentId);
}
