package com.shaluo.dbbikes.service;

import com.shaluo.dbbikes.model.CurrentWeatherForecast;
import com.shaluo.dbbikes.repository.CurrentWeatherForecastRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class WeatherForecastScheduler {

    @Value("${openweather.api.key}")
    private String apiKey;

    private final CurrentWeatherForecastRepository forecastRepository;

    public WeatherForecastScheduler(CurrentWeatherForecastRepository forecastRepository) {
        this.forecastRepository = forecastRepository;
    }

    @Scheduled(fixedRate = 600000) // 每10分钟
    public void fetchForecast() {
        String url = "https://api.openweathermap.org/data/2.5/forecast?lat=53.349805&lon=-6.260310&appid=" + apiKey + "&units=metric";
        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response == null || !response.containsKey("list")) return;

        List<Map<String, Object>> forecasts = (List<Map<String, Object>>) response.get("list");
        Map<String, Object> city = (Map<String, Object>) response.get("city");
        Map<String, Object> coord = (Map<String, Object>) city.get("coord");

        // ✅ 快速清表，放在循环外面
        forecastRepository.truncateTable();

        for (Map<String, Object> item : forecasts) {
            CurrentWeatherForecast forecast = new CurrentWeatherForecast();

            forecast.setForecastTime(LocalDateTime.parse((String) item.get("dt_txt"), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            forecast.setLongitude(((Number) coord.get("lon")).doubleValue());
            forecast.setLatitude(((Number) coord.get("lat")).doubleValue());

            Map<String, Object> main = (Map<String, Object>) item.get("main");
            forecast.setTemp(((Number) main.get("temp")).doubleValue());
            forecast.setFeelsLike(((Number) main.get("feels_like")).doubleValue());
            forecast.setTempMin(((Number) main.get("temp_min")).doubleValue());
            forecast.setTempMax(((Number) main.get("temp_max")).doubleValue());
            forecast.setPressure(((Number) main.get("pressure")).intValue());
            forecast.setHumidity(((Number) main.get("humidity")).intValue());
            forecast.setTempKf(main.get("temp_kf") != null ? ((Number) main.get("temp_kf")).doubleValue() : null);

            Map<String, Object> wind = (Map<String, Object>) item.get("wind");
            forecast.setWindSpeed(((Number) wind.get("speed")).doubleValue());
            forecast.setWindDeg(((Number) wind.get("deg")).intValue());

            forecast.setVisibility(item.get("visibility") != null ? ((Number) item.get("visibility")).intValue() : null);
            forecast.setClouds(((Number) ((Map<String, Object>) item.get("clouds")).get("all")).intValue());

            Map<String, Object> weatherInfo = ((List<Map<String, Object>>) item.get("weather")).get(0);
            forecast.setWeatherId(((Number) weatherInfo.get("id")).intValue());
            forecast.setWeatherMain((String) weatherInfo.get("main"));
            forecast.setWeatherDescription((String) weatherInfo.get("description"));
            forecast.setWeatherIcon((String) weatherInfo.get("icon"));

            forecast.setRecordedAt(LocalDateTime.now());

            forecastRepository.save(forecast);
        }
    }

}
