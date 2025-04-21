package com.shaluo.dbbikes.repository;

import com.shaluo.dbbikes.model.CurrentWeatherForecast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface CurrentWeatherForecastRepository extends JpaRepository<CurrentWeatherForecast, Long> {


    @Modifying
    @Transactional
    @Query(value = "TRUNCATE TABLE current_weather_forecast", nativeQuery = true)
    void truncateTable();
}
