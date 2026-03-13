package com.ratemyspot.repository;

import com.ratemyspot.dto.SpotRatingDTO;
import com.ratemyspot.entity.SpotReview;
import com.ratemyspot.response.SpotReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SpotReviewRepository extends JpaRepository<SpotReview, Long> {

    /**
     * Get aggregated rating stats for a spot from reviews.
     */
    @Query("SELECT new com.ratemyspot.dto.SpotRatingDTO(COUNT(r), AVG(r.rating)) " +
            "FROM SpotReview r WHERE r.spotId = :spotId")
    SpotRatingDTO findReviewRatingStats(@Param("spotId") Long spotId);

    /**
     * Find reviews by spot ID with user info projection.
     */
    @Query("SELECT new com.ratemyspot.response.SpotReviewResponse(" +
            "r.id, r.userId, u.nickname, u.icon, r.rating, r.content, r.images, r.createTime) " +
            "FROM SpotReview r " +
            "LEFT JOIN User u ON r.userId = u.id " +
            "WHERE r.spotId = :spotId " +
            "ORDER BY r.createTime DESC")
    Page<SpotReviewResponse> findSpotReviewsPage(@Param("spotId") Long spotId, Pageable pageable);

    /**
     * Admin: find all reviews with optional spotReviewId filter, ordered by create time DESC.
     */
    @Query("SELECT new com.ratemyspot.response.SpotReviewResponse(" +
            "r.id, r.userId, u.nickname, u.icon, r.rating, r.content, r.images, r.createTime) " +
            "FROM SpotReview r " +
            "LEFT JOIN User u ON r.userId = u.id " +
            "WHERE (:spotReviewId IS NULL OR r.id = :spotReviewId) " +
            "ORDER BY r.createTime DESC")
    Page<SpotReviewResponse> findAllForAdmin(
            @Param("spotReviewId") Long spotReviewId,
            Pageable pageable);
}