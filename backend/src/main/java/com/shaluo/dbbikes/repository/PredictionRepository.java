package com.shaluo.dbbikes.repository;

import com.shaluo.dbbikes.model.PredictionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PredictionRepository extends JpaRepository<PredictionResult, Long> {

    Optional<PredictionResult> findByNumberAndForecastTime(int number, LocalDateTime forecastTime);

    List<PredictionResult> findByNumberOrderByForecastTimeAsc(int number);

    void deleteByForecastTime(LocalDateTime forecastTime);

    /** 一刀切清空整张表，速度最快 */
    @Modifying
    @Transactional  // 让 TRUNCATE 在当前事务里执行
    @Query(value = "TRUNCATE TABLE prediction_results", nativeQuery = true)
    void truncate();
}
