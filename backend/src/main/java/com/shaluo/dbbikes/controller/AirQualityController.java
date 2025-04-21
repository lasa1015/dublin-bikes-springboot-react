package com.shaluo.dbbikes.controller;

import com.shaluo.dbbikes.model.AirQuality;
import com.shaluo.dbbikes.repository.AirQualityRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/airquality")
public class AirQualityController {

    private final AirQualityRepository airQualityRepository;

    public AirQualityController(AirQualityRepository airQualityRepository) {
        this.airQualityRepository = airQualityRepository;
    }

    // 获取最新的空气质量数据
    @GetMapping("/latest")
    public AirQuality getLatestAirQuality() {
        return airQualityRepository.findTopByOrderByRecordedTimeDesc();
    }
}
