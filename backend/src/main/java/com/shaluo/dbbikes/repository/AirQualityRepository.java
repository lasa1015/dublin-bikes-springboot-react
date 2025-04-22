package com.shaluo.dbbikes.repository;

import com.shaluo.dbbikes.model.CurrentAirQuality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AirQualityRepository extends JpaRepository<CurrentAirQuality, Long> {

}
