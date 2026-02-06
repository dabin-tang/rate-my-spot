package com.ratemyspot.repository;

import com.ratemyspot.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    /**
     * Projection for Post Feed
     */
    interface PostFeedProjection {
        Long getId();
        Long getSpotId();
        Long getUserId();
        String getTitle();
        String getContent();
        String getImages();
        Integer getRating();
        Integer getLiked();
        LocalDateTime getCreateTime();
        String getUserNickname();
        String getUserIcon();
        String getSpotName();
        String getCategoryName();
    }

    /**
     * Find post feed with dynamic filtering and sorting.
     */
    @Query(value = "SELECT p.id, p.spot_id AS spotId, p.user_id AS userId, p.title, p.content, p.images, " +
            "p.rating, p.liked, p.create_time AS createTime, p.user_nickname AS userNickname, " +
            "p.user_icon AS userIcon, s.name AS spotName, c.name AS categoryName " +
            "FROM post p " +
            "LEFT JOIN spot s ON p.spot_id = s.id " +
            "LEFT JOIN spot_category c ON s.category_id = c.id " +
            "WHERE p.status = 0 " +
            "AND (:categoryId IS NULL OR s.category_id = :categoryId) " +
            "ORDER BY " +
            "CASE WHEN :sort = 'latest' THEN p.create_time END DESC, " +
            "CASE WHEN :sort = 'default' THEN (p.liked * 0.1 + RAND()) END DESC ",
            countQuery = "SELECT COUNT(*) FROM post p " +
                    "LEFT JOIN spot s ON p.spot_id = s.id " +
                    "WHERE p.status = 0 " +
                    "AND (:categoryId IS NULL OR s.category_id = :categoryId)",
            nativeQuery = true)
    Page<PostFeedProjection> findFeed(@Param("categoryId") Long categoryId,
                                      @Param("sort") String sort,
                                      Pageable pageable);
}