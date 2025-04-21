package com.shaluo.dbbikes.repository;

import com.shaluo.dbbikes.model.AirQuality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AirQualityRepository extends JpaRepository<AirQuality, Long> {

    // 可选：获取最新一条记录
    AirQuality findTopByOrderByRecordedTimeDesc();
}
