package com.shaluo.dbbikes.service;

import com.shaluo.dbbikes.model.CurrentWeather;
import com.shaluo.dbbikes.repository.CurrentWeatherRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class CurrentWeatherScheduler {

    @Value("${openweather.api.key}")
    private String apiKey;

    private final CurrentWeatherRepository weatherRepository;

    public CurrentWeatherScheduler(CurrentWeatherRepository weatherRepository) {
        this.weatherRepository = weatherRepository;
    }

    @Scheduled(fixedRate = 3600000) // 每小时执行一次
    public void fetchWeather() {
        String url = "https://api.openweathermap.org/data/2.5/weather?lat=53.349805&lon=-6.260310&appid=" + apiKey + "&units=metric";

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response == null || response.isEmpty()) return;

        CurrentWeather weather = new CurrentWeather();
        weather.setLongitude((Double) ((Map<String, Object>) response.get("coord")).get("lon"));
        weather.setLatitude((Double) ((Map<String, Object>) response.get("coord")).get("lat"));

        Map<String, Object> main = (Map<String, Object>) response.get("main");
        Map<String, Object> wind = (Map<String, Object>) response.get("wind");
        Map<String, Object> clouds = (Map<String, Object>) response.get("clouds");
        Map<String, Object> weatherObj = ((java.util.List<Map<String, Object>>) response.get("weather")).get(0);

        weather.setWeatherMain((String) weatherObj.get("main"));
        weather.setWeatherDescription((String) weatherObj.get("description"));
        weather.setWeatherIcon((String) weatherObj.get("icon"));
        weather.setTemp(((Number) main.get("temp")).doubleValue());
        weather.setFeelsLike(((Number) main.get("feels_like")).doubleValue());
        weather.setTempMin(((Number) main.get("temp_min")).doubleValue());
        weather.setTempMax(((Number) main.get("temp_max")).doubleValue());
        weather.setPressure(((Number) main.get("pressure")).intValue());
        weather.setHumidity(((Number) main.get("humidity")).intValue());
        weather.setVisibility(response.get("visibility") != null ? ((Number) response.get("visibility")).intValue() : null);
        weather.setWindSpeed(((Number) wind.get("speed")).doubleValue());
        weather.setWindDeg(((Number) wind.get("deg")).intValue());
        weather.setClouds(((Number) clouds.get("all")).intValue());
        weather.setTimestamp(LocalDateTime.now());

        weather.setRecordedAt(LocalDateTime.now()); // 设置当前时间

        weatherRepository.deleteAll(); // 删除旧记录
        weatherRepository.save(weather);
    }
}
