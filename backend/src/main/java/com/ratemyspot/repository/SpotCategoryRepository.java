package com.ratemyspot.repository;

import com.ratemyspot.entity.SpotCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpotCategoryRepository extends JpaRepository<SpotCategory, Long> {
}