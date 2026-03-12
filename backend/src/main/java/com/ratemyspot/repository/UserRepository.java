package com.ratemyspot.repository;

import com.ratemyspot.entity.User;
import com.ratemyspot.response.AdminUserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /** Find a user entity by their email address. */
    Optional<User> findByEmail(String email);

    /** Check if a user with the given email already exists. */
    boolean existsByEmail(String email);

    /** Update the status of a user (0: Active, 1: Banned). */
    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.id = :userId")
    void updateStatus(@Param("userId") Long userId, @Param("status") Integer status);

    /**
     * Paginated user list for admin, supports optional nickname/email filters.
     * Use IS NULL OR to treat null params as "no filter".
     */
    @Query("SELECT new com.ratemyspot.response.AdminUserResponse(" +
            "u.id, u.email, u.nickname, u.icon, u.city, u.credit, u.status, u.createTime) " +
            "FROM User u " +
            "WHERE (:nickname IS NULL OR u.nickname LIKE CONCAT('%', :nickname, '%')) " +
            "AND (:email IS NULL OR u.email LIKE CONCAT('%', :email, '%')) " +
            "ORDER BY u.createTime DESC")
    Page<AdminUserResponse> findAdminUserList(
            @Param("nickname") String nickname,
            @Param("email") String email,
            Pageable pageable);
}
