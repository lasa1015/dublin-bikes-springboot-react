package com.shaluo.dbbikes.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "current_airquality")
public class CurrentAirQuality {

    @Id  // @Id 表示这个字段是数据库的主键
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 表示这个主键的值是由数据库自动生成的，采用的是 IDENTITY 策略，也就是最常见的自增主键。通常从1开始，每次自动递增
    private Long id;

    // LocalDateTime 是什么是 Java 8 引入的 java.time 包中的一个类，表示 没有时区的日期+时间
    // 例如 2025-04-22T14:35:00 ，有日期+时间，没有时区
    // 取决于你用的数据库，Spring Data JPA 会自动把 LocalDateTime 转换成数据库中相应的类型
    // MySQL → DATETIME 或 TIMESTAMP; PostgreSQL → timestamp without time zone
    private LocalDateTime recordedAt;
    private Double longitude;
    private Double latitude;
    private Integer aqi;
    private Double pm25;
    private Double pm10;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedTime) {
        this.recordedAt = recordedTime;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public int getAqi() {
        return aqi;
    }

    public void setAqi(int aqi) {
        this.aqi = aqi;
    }

    public double getPm25() {
        return pm25;
    }

    public void setPm25(double pm25) {
        this.pm25 = pm25;
    }

    public double getPm10() {
        return pm10;
    }

    public void setPm10(double pm10) {
        this.pm10 = pm10;
    }
}
