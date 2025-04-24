package com.shaluo.dbbikes.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.shaluo.dbbikes.model.CurrentWeatherForecast;
import com.shaluo.dbbikes.model.PredictionResult;
import com.shaluo.dbbikes.repository.CurrentWeatherForecastRepository;
import com.shaluo.dbbikes.repository.PredictionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PredictionScheduler {

    private static final Logger logger = LoggerFactory.getLogger(PredictionScheduler.class);

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final PredictionRepository predictionRepository;
    private final CurrentWeatherForecastRepository forecastRepository;

    public PredictionScheduler(PredictionRepository predictionRepository,
                               CurrentWeatherForecastRepository forecastRepository) {
        this.predictionRepository = predictionRepository;
        this.forecastRepository = forecastRepository;
    }

    /** 每小时执行一次，延迟 15 s 让 Hibernate 先建表 */
//    @Scheduled(fixedRate = 3600000)
    public void fetchAndSavePredictions() {

        try {
            List<CurrentWeatherForecast> forecasts = forecastRepository.findAll();
            if (forecasts.isEmpty()) {
                logger.error("❌ 天气预报数据为空，无法预测。");
                return;
            }

            /* ---------- 1. 清空旧数据 ---------- */
            logger.info("🧹 TRUNCATE prediction_result …");
            predictionRepository.truncate();
            logger.info("✅ 旧数据已全部清空");

            /* ---------- 2. 发送批量预测请求 ---------- */
            List<ObjectNode> weatherBatch = toWeatherBatch(forecasts);
            logger.info("🚀 发送批量预测请求，共 {} 条天气数据", weatherBatch.size());

            JsonNode response = restTemplate.postForObject(
                    "http://localhost:5000/predict_batch", weatherBatch, JsonNode.class);

            if (response == null || response.isEmpty()) {
                logger.error("❌ Python 服务未返回结果");
                return;
            }
            logger.info("✅ 收到 {} 条预测结果", response.size());

            /* ---------- 3. 分块保存 ---------- */
            List<PredictionResult> all = buildEntities(response);
            final int CHUNK = 100;            // 每 500 条写一次库

            for (int start = 0; start < all.size(); start += CHUNK) {
                int end = Math.min(start + CHUNK, all.size());
                predictionRepository.saveAll(all.subList(start, end));
                predictionRepository.flush();                         // 立即落库
                logger.info("📥 已保存 {}-{} / {}", start, end - 1, all.size());
            }
            logger.info("✅ 批量保存完成，共 {} 条记录", all.size());

        } catch (Exception ex) {
            logger.error("❌ 预测任务失败", ex);
        }
    }

    /* ---------- 私有工具方法 ---------- */

    /** 把天气列表转成 Python 所需 JSON */
    private List<ObjectNode> toWeatherBatch(List<CurrentWeatherForecast> forecasts) {
        List<ObjectNode> list = new ArrayList<>(forecasts.size());
        for (CurrentWeatherForecast f : forecasts) {
            ObjectNode w = objectMapper.createObjectNode();
            w.put("temp", f.getTemp());
            w.put("pressure", f.getPressure());
            w.put("humidity", f.getHumidity());
            w.put("visibility", f.getVisibility());
            w.put("wind_speed", f.getWindSpeed());
            w.put("wind_deg", f.getWindDeg());
            w.put("clouds", f.getClouds());
            w.put("hour", f.getForecastTime().getHour());
            w.put("weekday", f.getForecastTime().getDayOfWeek().getValue() % 7);
            w.put("weather_description", f.getWeatherDescription());
            w.put("forecast_time", f.getForecastTime().toString());
            list.add(w);
        }
        return list;
    }

    /** 把 Python 返回 JSON 组装成实体列表 */
    private List<PredictionResult> buildEntities(JsonNode response) {
        List<PredictionResult> list = new ArrayList<>(response.size());
        for (JsonNode n : response) {
            PredictionResult pr = new PredictionResult();
            pr.setNumber(n.get("number").asInt());
            pr.setForecastTime(LocalDateTime.parse(n.get("forecast_time").asText()));
            pr.setAvailableBikes(n.get("available_bikes").asInt());
            pr.setAvailableBikeStands(n.get("available_bike_stands").asInt());
            pr.setRecordedAt(LocalDateTime.now());
            list.add(pr);
        }
        return list;
    }
}
