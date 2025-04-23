package com.shaluo.dbbikes.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.shaluo.dbbikes.model.CurrentWeather;
import com.shaluo.dbbikes.model.PredictionResult;
import com.shaluo.dbbikes.repository.CurrentWeatherRepository;
import com.shaluo.dbbikes.repository.PredictionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class PredictionScheduler {

    private static final Logger logger = LoggerFactory.getLogger(PredictionScheduler.class);
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final PredictionRepository predictionRepository;
    private final CurrentWeatherRepository currentWeatherRepository;

    public PredictionScheduler(PredictionRepository predictionRepository,
                               CurrentWeatherRepository currentWeatherRepository) {
        this.predictionRepository = predictionRepository;
        this.currentWeatherRepository = currentWeatherRepository;
    }

    // 每小时执行一次
    @Scheduled(fixedRate = 3600000)
    public void fetchAndSavePredictions() {
        try {

            List<CurrentWeather> weatherList = currentWeatherRepository.findAll();

            if (weatherList.isEmpty()) {
                logger.error(" ❌ 当前天气数据为空，模型无法进行预测。");
                return;
            }


            CurrentWeather weather = weatherList.get(0);

            logger.info(" ✅ 当前天气数据内容：{}", weather);

            // 构造天气请求 JSON
            ObjectNode weatherData = objectMapper.createObjectNode();
            weatherData.put("temp", weather.getTemp());
            weatherData.put("pressure", weather.getPressure());
            weatherData.put("humidity", weather.getHumidity());
            weatherData.put("visibility", weather.getVisibility());
            weatherData.put("wind_speed", weather.getWindSpeed());
            weatherData.put("wind_deg", weather.getWindDeg());
            weatherData.put("clouds", weather.getClouds());
            weatherData.put("hour", weather.getRecordedAt().getHour());
            weatherData.put("weekday", weather.getRecordedAt().getDayOfWeek().getValue() % 7); // 周一为0
            weatherData.put("weather_description", weather.getWeatherDescription());

            logger.info(" 构造的预测请求参数为：{}", weatherData.toPrettyString());

            // 向 Python 模型服务发起 POST 请求
            String url = "http://localhost:5000/predict";
            JsonNode response = restTemplate.postForObject(url, weatherData, JsonNode.class);

            // 将结果存入数据库
            List<PredictionResult> results = new ArrayList<>();
            LocalDateTime now = LocalDateTime.now();

            for (JsonNode node : response) {
                int number = node.get("number").asInt();

                PredictionResult prediction = predictionRepository.findByNumber(number)
                        .orElse(new PredictionResult());

                prediction.setNumber(number);
                prediction.setAvailableBikes(node.get("available_bikes").asInt());
                prediction.setAvailableBikeStands(node.get("available_bike_stands").asInt());
                prediction.setRecordedAt(now);

                results.add(prediction);
            }

            predictionRepository.saveAll(results);
            logger.info("✅ 使用当前天气数据成功预测并保存，共 {} 条", results.size());

        } catch (Exception e) {
            logger.error("❌ 获取或保存预测数据时出错：" + e.getMessage(), e);
        }
    }
}
