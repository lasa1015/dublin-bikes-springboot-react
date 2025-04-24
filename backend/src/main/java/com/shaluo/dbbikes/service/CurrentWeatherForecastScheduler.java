package com.shaluo.dbbikes.service;

import com.shaluo.dbbikes.model.CurrentWeatherForecast;
import com.shaluo.dbbikes.repository.CurrentWeatherForecastRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class CurrentWeatherForecastScheduler {

    @Value("${openweather.api.key}")
    private String apiKey;

    private final CurrentWeatherForecastRepository forecastRepository;

    private static final Logger logger = LoggerFactory.getLogger(CurrentWeatherForecastScheduler.class);

    public CurrentWeatherForecastScheduler(CurrentWeatherForecastRepository forecastRepository) {
        this.forecastRepository = forecastRepository;
    }

    @Scheduled(fixedRate = 3600000) // 每60分钟
    public void fetchForecast() {

        try {
            String url = "https://api.openweathermap.org/data/2.5/forecast?lat=53.349805&lon=-6.260310&appid=" + apiKey + "&units=metric";

            RestTemplate restTemplate = new RestTemplate();

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null || !response.containsKey("list")) {
                logger.error("❌ OpenWeather forecast 接口返回空数据或格式错误");
                return;
            }

            List<Map<String, Object>> forecasts = (List<Map<String, Object>>) response.get("list");
            Map<String, Object> city = (Map<String, Object>) response.get("city");
            Map<String, Object> coord = (Map<String, Object>) city.get("coord");

            forecastRepository.truncateTable(); //  清空表中所有旧数据

            for (Map<String, Object> item : forecasts) {

                CurrentWeatherForecast forecastItem = new CurrentWeatherForecast();

                forecastItem.setForecastTime(LocalDateTime.parse((String) item.get("dt_txt"), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                forecastItem.setLongitude(((Number) coord.get("lon")).doubleValue());
                forecastItem.setLatitude(((Number) coord.get("lat")).doubleValue());

                Map<String, Object> main = (Map<String, Object>) item.get("main");
                forecastItem.setTemp(((Number) main.get("temp")).doubleValue());
                forecastItem.setFeelsLike(((Number) main.get("feels_like")).doubleValue());
                forecastItem.setTempMin(((Number) main.get("temp_min")).doubleValue());
                forecastItem.setTempMax(((Number) main.get("temp_max")).doubleValue());
                forecastItem.setPressure(((Number) main.get("pressure")).intValue());
                forecastItem.setHumidity(((Number) main.get("humidity")).intValue());
                forecastItem.setTempKf(main.get("temp_kf") != null ? ((Number) main.get("temp_kf")).doubleValue() : null);

                Map<String, Object> wind = (Map<String, Object>) item.get("wind");
                forecastItem.setWindSpeed(((Number) wind.get("speed")).doubleValue());
                forecastItem.setWindDeg(((Number) wind.get("deg")).intValue());

                forecastItem.setVisibility(item.get("visibility") != null ? ((Number) item.get("visibility")).intValue() : null);
                forecastItem.setClouds(((Number) ((Map<String, Object>) item.get("clouds")).get("all")).intValue());

                Map<String, Object> weatherInfo = ((List<Map<String, Object>>) item.get("weather")).get(0);
                forecastItem.setWeatherId(((Number) weatherInfo.get("id")).intValue());
                forecastItem.setWeatherMain((String) weatherInfo.get("main"));
                forecastItem.setWeatherDescription((String) weatherInfo.get("description"));
                forecastItem.setWeatherIcon((String) weatherInfo.get("icon"));

                forecastItem.setRecordedAt(LocalDateTime.now());

                // 每一条在循环中 逐条 save() 保存 到数据库里的
                forecastRepository.save(forecastItem);
            }

            logger.info("✅ current weather forecast 数据已成功存入数据库，共 {} 条记录", forecasts.size());

        } catch (Exception e) {

            logger.error("❌ 抓取天气预报数据出错：{}", e.getMessage(), e);
        }
    }
}
