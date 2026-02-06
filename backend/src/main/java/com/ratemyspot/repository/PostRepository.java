package com.ratemyspot.repository;

import com.ratemyspot.entity.Post;
import com.ratemyspot.response.PostResponse;
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
     * Find post feed with dynamic filtering and sorting.
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
            "WHERE p.status = 0 " +
            "AND (:categoryId IS NULL OR s.categoryId = :categoryId) " +
            "ORDER BY " +
            "CASE WHEN :sort = 'latest' THEN p.createTime END DESC, " +
            "CASE WHEN :sort = 'default' THEN (p.liked * 0.1 + function('RAND')) END DESC")
    Page<PostResponse> findFeedVO(@Param("categoryId") Long categoryId,
                                  @Param("sort") String sort,
                                  Pageable pageable);

    // PostRepository.java
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
}