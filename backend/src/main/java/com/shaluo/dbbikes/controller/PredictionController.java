package com.shaluo.dbbikes.controller;

import com.shaluo.dbbikes.model.PredictionResult;
import com.shaluo.dbbikes.repository.PredictionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    private final PredictionRepository predictionRepository;

    public PredictionController(PredictionRepository predictionRepository) {
        this.predictionRepository = predictionRepository;
    }

    // 获取所有预测结果
    @GetMapping("/all")
    public List<PredictionResult> getAllPredictions() {
        return predictionRepository.findAll();
    }

    // 获取某个车站的全部预测记录（按 forecastTime 升序）
    @GetMapping("/station/{number}")
    public List<PredictionResult> getPredictionsByStationNumber(@PathVariable int number) {
        return predictionRepository.findByNumberOrderByForecastTimeAsc(number);
    }
}
