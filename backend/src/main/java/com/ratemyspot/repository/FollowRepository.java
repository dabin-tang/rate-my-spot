package com.ratemyspot.repository;

import com.ratemyspot.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    
    /**
     * Check if user follows the author
     */
    boolean existsByUserIdAndFollowUserId(Long userId, Long followUserId);
}