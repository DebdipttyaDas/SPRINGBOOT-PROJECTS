package com.civicai.backend.repository;

import com.civicai.backend.entity.CivicIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CivicIssueRepository extends JpaRepository<CivicIssue, Long> {

    List<CivicIssue> findByWardNumberOrderByCreatedAtDesc(String wardNumber);

    List<CivicIssue> findByCategoryIgnoreCase(String category);

    List<CivicIssue> findByUrgencyIgnoreCase(String urgency);

    List<CivicIssue> findByStatusIgnoreCase(String status);

    List<CivicIssue> findAllByOrderByCreatedAtDesc();

    @Query("SELECT c.category, COUNT(c) FROM CivicIssue c GROUP BY c.category")
    List<Object[]> countByCategory();

    @Query("SELECT c.urgency, COUNT(c) FROM CivicIssue c GROUP BY c.urgency")
    List<Object[]> countByUrgency();

    @Query("SELECT c.status, COUNT(c) FROM CivicIssue c GROUP BY c.status")
    List<Object[]> countByStatus();

    @Query("SELECT c.wardNumber, COUNT(c) FROM CivicIssue c GROUP BY c.wardNumber")
    List<Object[]> countByWard();
}
