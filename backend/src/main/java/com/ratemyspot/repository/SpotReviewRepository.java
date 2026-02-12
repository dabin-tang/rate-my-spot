package com.ratemyspot.repository;

import com.ratemyspot.dto.SpotRatingDTO;
import com.ratemyspot.entity.SpotReview;
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
}