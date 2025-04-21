package com.shaluo.dbbikes.controller;

import com.shaluo.dbbikes.model.CurrentAirQuality;
import com.shaluo.dbbikes.repository.AirQualityRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/airquality")
public class CurrentAirQualityController {

    private final AirQualityRepository airQualityRepository;

    public CurrentAirQualityController(AirQualityRepository airQualityRepository) {
        this.airQualityRepository = airQualityRepository;
    }

    // 获取最新的空气质量数据
    @GetMapping("/latest")
    public CurrentAirQuality getLatestAirQuality() {
        return airQualityRepository.findTopByOrderByRecordedTimeDesc();
    }
}
