package com.shaluo.dbbikes.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shaluo.dbbikes.model.CurrentAirQuality;
import com.shaluo.dbbikes.repository.AirQualityRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@Component
public class CurrentAirQualityScheduler {

    private final AirQualityRepository airQualityRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // 从 Spring Boot 配置源中读取名为 openweather.api.key 的配置值，并注入到变量 apiKey 中。
    @Value("${openweather.api.key}")
    private String apiKey;

    public CurrentAirQualityScheduler(AirQualityRepository airQualityRepository) {
        this.airQualityRepository = airQualityRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    @Scheduled(fixedRate = 600000) // 每10分钟抓一次
    public void fetchAirQualityData() {
        try {
            String url = "http://api.openweathermap.org/data/2.5/air_pollution?lat=53.349805&lon=-6.26031&appid=" + apiKey;

            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);

            JsonNode list = root.get("list").get(0);
            JsonNode main = list.get("main");
            JsonNode components = list.get("components");

            CurrentAirQuality aq = new CurrentAirQuality();
            aq.setRecordedTime(LocalDateTime.now());
            aq.setLatitude(53.349805);
            aq.setLongitude(-6.26031);
            aq.setAqi(main.get("aqi").asInt());
            aq.setPm25(components.get("pm2_5").asDouble());
            aq.setPm10(components.get("pm10").asDouble());

            airQualityRepository.deleteAll(); // 清空旧数据，保证只保留最新一条
            airQualityRepository.save(aq);

            System.out.println("✅air quality数据已经存入数据库");

        } catch (Exception e) {
            System.err.println("Error fetching air quality: " + e.getMessage());
        }
    }
}
