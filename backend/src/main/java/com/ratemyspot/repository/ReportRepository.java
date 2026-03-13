package com.ratemyspot.repository;

import com.ratemyspot.entity.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    /** Find reports by status, ordered by create time DESC. */
    Page<Report> findByStatusOrderByCreateTimeDesc(Integer status, Pageable pageable);

    /** Find all reports ordered by create time DESC. */
    Page<Report> findAllByOrderByCreateTimeDesc(Pageable pageable);
}
