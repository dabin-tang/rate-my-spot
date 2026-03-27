package com.ratemyspot.repository;

import com.ratemyspot.entity.PostComment;
import com.ratemyspot.response.AdminCommentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {

    /** Retrieve all comments belonging to a given post, ordered by creation time ascending. */
    List<PostComment> findAllByPostIdOrderByCreateTimeAsc(Long postId);

    /** Count all comments for a given post (used in post detail response). */
    long countByPostId(Long postId);

    /** Delete all child replies of a given parent comment. */
    void deleteAllByParentId(Long parentId);

    /**
     * Admin paginated comment list with optional postId and keyword filters.
     * Uses IS NULL OR pattern so null params are treated as no filter.
     */
    @Query("SELECT new com.ratemyspot.response.AdminCommentResponse(" +
            "c.id, c.postId, c.userId, c.parentId, c.content, c.image, c.liked, c.createTime) " +
            "FROM PostComment c " +
            "WHERE (:postId IS NULL OR c.postId = :postId) " +
            "AND (:keyword IS NULL OR c.content LIKE CONCAT('%', :keyword, '%')) " +
            "ORDER BY c.createTime DESC")
    Page<AdminCommentResponse> findAllForAdmin(
            @Param("postId") Long postId,
            @Param("keyword") String keyword,
            Pageable pageable);

    /** Increment liked count for a comment. */
    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE PostComment c SET c.liked = c.liked + 1 WHERE c.id = :commentId")
    void incrementLiked(@Param("commentId") Long commentId);

    /** Decrement liked count for a comment. */
    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE PostComment c SET c.liked = c.liked - 1 WHERE c.id = :commentId AND c.liked > 0")
    void decrementLiked(@Param("commentId") Long commentId);
}

