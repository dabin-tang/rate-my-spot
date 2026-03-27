package com.ratemyspot.repository;

import com.ratemyspot.entity.PostLike;
import com.ratemyspot.response.PostResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    
    /**
     * Check if user liked the post
     */
    boolean existsByUserIdAndPostId(Long userId, Long postId);

    /**
     * Delete like record by user and post
     */
    void deleteByUserIdAndPostId(Long userId, Long postId);

    /** Delete all like records for a post (used when deleting the post). */
    void deleteAllByPostId(Long postId);

    /**
     * Find liked posts by user ID with projection.
     */
    @Query("SELECT new com.ratemyspot.response.PostResponse(" +
            "p.id, p.spotId, p.userId, p.userNickname, p.userIcon, " +
            "p.title, p.content, p.images, p.rating, p.liked, " +
            "p.status, p.createTime, p.updateTime, " +
            "s.name, c.name) " +
            "FROM PostLike pl " +
            "JOIN Post p ON pl.postId = p.id " +
            "LEFT JOIN Spot s ON p.spotId = s.id " +
            "LEFT JOIN SpotCategory c ON s.categoryId = c.id " +
            "WHERE pl.userId = :userId AND p.status = 0 " +
            "ORDER BY pl.createTime DESC")
    Page<PostResponse> findLikedPosts(@Param("userId") Long userId, Pageable pageable);
}