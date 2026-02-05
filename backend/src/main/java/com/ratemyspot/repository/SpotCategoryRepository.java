package com.ratemyspot.repository;

import com.ratemyspot.entity.SpotCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpotCategoryRepository extends JpaRepository<SpotCategory, Long> {

    /**
     * Find all categories ordered by sort field ascending.
     *
     * @return List of SpotCategory
     */
    List<SpotCategory> findAllByOrderBySortAsc();
}