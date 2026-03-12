package com.ratemyspot.repository;

import com.ratemyspot.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    /** Find an admin by their login username. */
    Optional<Admin> findByUsername(String username);
}