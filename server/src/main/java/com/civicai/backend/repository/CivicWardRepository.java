package com.civicai.backend.repository;

import com.civicai.backend.entity.CivicWard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CivicWardRepository extends JpaRepository<CivicWard, Long> {
    Optional<CivicWard> findByWardNumber(String wardNumber);
}
