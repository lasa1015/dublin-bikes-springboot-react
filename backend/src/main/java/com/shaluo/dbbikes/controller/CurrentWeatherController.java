package com.shaluo.dbbikes.controller;

import com.shaluo.dbbikes.model.CurrentWeather;
import com.shaluo.dbbikes.repository.CurrentWeatherRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/current-weather")
public class CurrentWeatherController {

    private final CurrentWeatherRepository weatherRepository;

    public CurrentWeatherController(CurrentWeatherRepository weatherRepository) {
        this.weatherRepository = weatherRepository;
    }


    @GetMapping("/latest")
    public CurrentWeather getLatestWeather() {

        return weatherRepository.findAll().get(0);
    }
}
