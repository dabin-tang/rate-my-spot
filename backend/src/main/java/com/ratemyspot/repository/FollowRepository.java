package com.ratemyspot.repository;

import com.ratemyspot.entity.Follow;
import com.ratemyspot.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    /** Check if user follows the target user. */
    boolean existsByUserIdAndFollowUserId(Long userId, Long followUserId);

    /** Delete the follow relationship between two users. */
    void deleteByUserIdAndFollowUserId(Long userId, Long followUserId);

    /** Count the number of followers for a given user. */
    long countByFollowUserId(Long followUserId);

    /** Count the number of users a given user is following. */
    long countByUserId(Long userId);

    /** Get paginated list of followers for a given user using Constructor Projection. */
    @Query("SELECT new com.ratemyspot.response.UserResponse(" +
            "u.id, u.nickname, u.icon, u.city, u.intro) " +
            "FROM Follow f " +
            "JOIN User u ON f.userId = u.id " +
            "WHERE f.followUserId = :userId " +
            "ORDER BY f.createTime DESC")
    Page<UserResponse> findFollowersVO(@Param("userId") Long userId, Pageable pageable);

    /** Get paginated list of users the given user is following using Constructor Projection. */
    @Query("SELECT new com.ratemyspot.response.UserResponse(" +
            "u.id, u.nickname, u.icon, u.city, u.intro) " +
            "FROM Follow f " +
            "JOIN User u ON f.followUserId = u.id " +
            "WHERE f.userId = :userId " +
            "ORDER BY f.createTime DESC")
    Page<UserResponse> findFollowingVO(@Param("userId") Long userId, Pageable pageable);
}

