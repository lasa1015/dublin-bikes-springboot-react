// Controller
package com.shaluo.dbbikes.controller;

import com.shaluo.dbbikes.model.CurrentWeatherForecast;
import com.shaluo.dbbikes.repository.CurrentWeatherForecastRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/current-weather-forecast")
public class CurrentWeatherForecastController {

    private final CurrentWeatherForecastRepository forecastRepository;

    public CurrentWeatherForecastController(CurrentWeatherForecastRepository forecastRepository) {
        this.forecastRepository = forecastRepository;
    }

    @GetMapping("/all")
    public List<CurrentWeatherForecast> getAllForecasts() {
        return forecastRepository.findAll();
    }
}
