package com.shaluo.dbbikes.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shaluo.dbbikes.model.AirQuality;
import com.shaluo.dbbikes.repository.AirQualityRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@Component
public class AirQualityScheduler {

    private final AirQualityRepository airQualityRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${openweather.api.key}")
    private String apiKey;

    public AirQualityScheduler(AirQualityRepository airQualityRepository) {
        this.airQualityRepository = airQualityRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    @Scheduled(fixedRate = 300000) // 每5分钟抓一次
    public void fetchAirQualityData() {
        try {
            String url = "http://api.openweathermap.org/data/2.5/air_pollution?lat=53.349805&lon=-6.26031&appid=" + apiKey;

            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);

            JsonNode list = root.get("list").get(0);
            JsonNode main = list.get("main");
            JsonNode components = list.get("components");

            AirQuality aq = new AirQuality();
            aq.setRecordedTime(LocalDateTime.now());
            aq.setLatitude(53.349805);
            aq.setLongitude(-6.26031);
            aq.setAqi(main.get("aqi").asInt());
            aq.setPm25(components.get("pm2_5").asDouble());
            aq.setPm10(components.get("pm10").asDouble());

            airQualityRepository.save(aq);

        } catch (Exception e) {
            System.err.println("Error fetching air quality: " + e.getMessage());
        }
    }
}
