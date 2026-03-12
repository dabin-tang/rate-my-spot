package com.ratemyspot.repository;

import com.ratemyspot.dto.SpotRatingDTO;
import com.ratemyspot.entity.Post;
import com.ratemyspot.response.PostResponse;
import com.ratemyspot.response.RecentPostResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    /** Count posts created after a given timestamp (used for daily post stats). */
    long countByCreateTimeAfter(LocalDateTime dateTime);

    /**
     * Find all posts for admin review (no status filter), ordered by create time DESC.
     */
    @Query("SELECT new com.ratemyspot.response.PostResponse(" +
            "p.id, p.spotId, p.userId, p.userNickname, p.userIcon, " +
            "p.title, p.content, p.images, p.rating, p.liked, " +
            "p.status, p.createTime, p.updateTime, " +
            "s.name, c.name) " +
            "FROM Post p " +
            "LEFT JOIN Spot s ON p.spotId = s.id " +
            "LEFT JOIN SpotCategory c ON s.categoryId = c.id " +
            "ORDER BY p.createTime DESC")
    Page<PostResponse> findAllForAdmin(Pageable pageable);

    /**
     * Find post feed sorted by latest (create_time DESC).
     */
    @Query("SELECT new com.ratemyspot.response.PostResponse(" +
            "p.id, p.spotId, p.userId, p.userNickname, p.userIcon, " +
            "p.title, p.content, p.images, p.rating, p.liked, " +
            "p.status, p.createTime, p.updateTime, " +
            "s.name, c.name) " +
            "FROM Post p " +
            "LEFT JOIN Spot s ON p.spotId = s.id " +
            "LEFT JOIN SpotCategory c ON s.categoryId = c.id " +
            "WHERE p.status = 0 " +
            "AND (:categoryId IS NULL OR s.categoryId = :categoryId) " +
            "ORDER BY p.createTime DESC")
    Page<PostResponse> findFeedLatest(@Param("categoryId") Long categoryId, Pageable pageable);

    /**
     * Find post feed sorted by default algorithm (liked * 0.1 + RAND()).
     */
    @Query("SELECT new com.ratemyspot.response.PostResponse(" +
            "p.id, p.spotId, p.userId, p.userNickname, p.userIcon, " +
            "p.title, p.content, p.images, p.rating, p.liked, " +
            "p.status, p.createTime, p.updateTime, " +
            "s.name, c.name) " +
            "FROM Post p " +
            "LEFT JOIN Spot s ON p.spotId = s.id " +
            "LEFT JOIN SpotCategory c ON s.categoryId = c.id " +
            "WHERE p.status = 0 " +
            "AND (:categoryId IS NULL OR s.categoryId = :categoryId) " +
            "ORDER BY (p.liked * 0.1 + cast(function('RAND') as Double)) DESC")
    Page<PostResponse> findFeedDefault(@Param("categoryId") Long categoryId, Pageable pageable);

    /**
     * Find post detail by ID.
     * Uses JPQL Constructor Expression to return PostResponse directly.
     */
    @Query("SELECT new com.ratemyspot.response.PostResponse(" +
            "p.id, p.spotId, p.userId, p.userNickname, p.userIcon, " +
            "p.title, p.content, p.images, p.rating, p.liked, " +
            "p.status, p.createTime, p.updateTime, " +
            "s.name, c.name) " +
            "FROM Post p " +
            "LEFT JOIN Spot s ON p.spotId = s.id " +
            "LEFT JOIN SpotCategory c ON s.categoryId = c.id " +
            "WHERE p.id = :id AND p.status = 0")
    PostResponse findPostDetailVO(@Param("id") Long id);

    /**
     * Get aggregated rating stats for a spot from posts.
     */
    @Query("SELECT new com.ratemyspot.dto.SpotRatingDTO(COUNT(p), AVG(p.rating)) " +
            "FROM Post p WHERE p.spotId = :spotId AND p.status = 0")
    SpotRatingDTO findPostRatingStats(@Param("spotId") Long spotId);

    /**
     * Get posts by user ID.
     */
    @Query("SELECT new com.ratemyspot.response.PostResponse(" +
            "p.id, p.spotId, p.userId, p.userNickname, p.userIcon, " +
            "p.title, p.content, p.images, p.rating, p.liked, " +
            "p.status, p.createTime, p.updateTime, " +
            "s.name, c.name) " +
            "FROM Post p " +
            "LEFT JOIN Spot s ON p.spotId = s.id " +
            "LEFT JOIN SpotCategory c ON s.categoryId = c.id " +
            "WHERE p.userId = :userId AND p.status = 0 " +
            "ORDER BY p.createTime DESC")
    Page<PostResponse> findUserPostsVO(@Param("userId") Long userId, Pageable pageable);

    /**
     * Get recent posts for a spot.
     */
    @Query("SELECT new com.ratemyspot.response.RecentPostResponse(" +
            "p.id, p.spotId, p.userId, p.userNickname, p.userIcon, " +
            "p.title, p.content, p.images, p.status, " +
            "p.createTime, p.updateTime) " +
            "FROM Post p " +
            "WHERE p.spotId = :spotId AND p.status = 0 " +
            "ORDER BY p.createTime DESC")
    Page<RecentPostResponse> findRecentPostsVO(@Param("spotId") Long spotId, Pageable pageable);

    /**
     * Increment liked count.
     */
    @Modifying
    @Query("UPDATE Post p SET p.liked = p.liked + 1 WHERE p.id = :postId")
    void incrementLiked(@Param("postId") Long postId);

    /**
     * Decrement liked count.
     */
    @Modifying
    @Query("UPDATE Post p SET p.liked = p.liked - 1 WHERE p.id = :postId AND p.liked > 0")
    void decrementLiked(@Param("postId") Long postId);
}