package com.shaluo.dbbikes.service;

import com.shaluo.dbbikes.model.CurrentWeather;
import com.shaluo.dbbikes.repository.CurrentWeatherRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class CurrentWeatherScheduler {

    @Value("${openweather.api.key}")
    private String apiKey;

    private final CurrentWeatherRepository weatherRepository;

    private static final Logger logger = LoggerFactory.getLogger(CurrentWeatherScheduler.class);

    public CurrentWeatherScheduler(CurrentWeatherRepository weatherRepository) {
        this.weatherRepository = weatherRepository;
    }

    @Scheduled(fixedRate = 3600000) // 每小时执行一次
    public void fetchWeather() {

        try {
            String url = "https://api.openweathermap.org/data/2.5/weather?lat=53.349805&lon=-6.260310&appid=" + apiKey + "&units=metric";

            RestTemplate restTemplate = new RestTemplate();

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null || response.isEmpty()) {
                logger.error("❌ OpenWeather 返回空响应，跳过本次抓取");
                return;
            }

            CurrentWeather weather = new CurrentWeather();

            Map<String, Object> coord = (Map<String, Object>) response.get("coord");
            weather.setLongitude(coord != null ? ((Number) coord.get("lon")).doubleValue() : null);
            weather.setLatitude(coord != null ? ((Number) coord.get("lat")).doubleValue() : null);

            Map<String, Object> main = (Map<String, Object>) response.get("main");
            Map<String, Object> wind = (Map<String, Object>) response.get("wind");
            Map<String, Object> clouds = (Map<String, Object>) response.get("clouds");

            List<Map<String, Object>> weatherList = (List<Map<String, Object>>) response.get("weather");
            Map<String, Object> weatherObj = weatherList.get(0);


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

            weather.setRecordedAt(LocalDateTime.now()); // 设置抓取时间

            weatherRepository.deleteAll(); // 清空旧数据
            weatherRepository.save(weather); // 保存最新一条

            logger.info("✅ current weather 数据已成功存入数据库");

        } catch (Exception e) {
            logger.error("❌ 抓取当前天气数据出错：{}", e.getMessage(), e);
        }
    }
}
