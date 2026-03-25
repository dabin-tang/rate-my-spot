package com.ratemyspot.repository;

import com.ratemyspot.entity.Spot;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpotRepository extends JpaRepository<Spot, Long> {

    /**
     * Find spots filtered by category (optional) and sorted by calculated distance.
     */
    @Query("SELECT s FROM Spot s WHERE (:categoryId IS NULL OR s.categoryId = :categoryId) " +
            "AND (:keyword IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%',:keyword,'%')) OR LOWER(s.description) LIKE LOWER(CONCAT('%',:keyword,'%'))) " +
            "ORDER BY ((s.x - :lon) * (s.x - :lon) + (s.y - :lat) * (s.y - :lat)) ASC")
    Page<Spot> findByFilterOrderByDistance(Long categoryId, String keyword, Double lat, Double lon, Pageable pageable);

    /**
     * Find spots filtered by category (optional) and sorted by score descending.
     */
    @Query("SELECT s FROM Spot s WHERE (:categoryId IS NULL OR s.categoryId = :categoryId) " +
            "AND (:keyword IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%',:keyword,'%')) OR LOWER(s.description) LIKE LOWER(CONCAT('%',:keyword,'%'))) " +
            "ORDER BY s.score DESC")
    Page<Spot> findByFilterOrderByScore(Long categoryId, String keyword, Pageable pageable);

    /**
     * Find spots filtered by category (optional) with default sort (ID DESC).
     */
    @Query("SELECT s FROM Spot s WHERE (:categoryId IS NULL OR s.categoryId = :categoryId) " +
            "AND (:keyword IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%',:keyword,'%')) OR LOWER(s.description) LIKE LOWER(CONCAT('%',:keyword,'%'))) " +
            "ORDER BY s.id DESC")
    Page<Spot> findByFilterDefault(Long categoryId, String keyword, Pageable pageable);

    /**
     * Search spots by name or description containing the keyword (Case Insensitive).
     */
    List<Spot> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
}