package com.shaluo.dbbikes.repository;


import com.shaluo.dbbikes.model.PredictionResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PredictionRepository extends JpaRepository<PredictionResult, Long> {
    Optional<PredictionResult> findByNumber(int number);

}
