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

    // 获取指定车站的预测结果
    @GetMapping("/{number}")
    public PredictionResult getPredictionByNumber(@PathVariable int number) {
        return predictionRepository.findByNumber(number).orElse(null);
    }
}
