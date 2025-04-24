package com.shaluo.dbbikes.model;// model/BikePrediction.java


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prediction_results")
public class PredictionResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer number;
    private Integer availableBikes;
    private Integer availableBikeStands;
    private LocalDateTime recordedAt;

    private LocalDateTime forecastTime;

    public LocalDateTime getForecastTime() {
        return forecastTime;
    }

    public void setForecastTime(LocalDateTime forecastTime) {
        this.forecastTime = forecastTime;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public Integer getAvailableBikes() {
        return availableBikes;
    }

    public void setAvailableBikes(Integer availableBikes) {
        this.availableBikes = availableBikes;
    }

    public Integer getAvailableBikeStands() {
        return availableBikeStands;
    }

    public void setAvailableBikeStands(Integer availableBikeStands) {
        this.availableBikeStands = availableBikeStands;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }
}
