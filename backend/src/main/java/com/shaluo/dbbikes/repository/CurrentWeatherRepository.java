package com.shaluo.dbbikes.repository;

import com.shaluo.dbbikes.model.CurrentWeather;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CurrentWeatherRepository extends JpaRepository<CurrentWeather, Long> {

}
