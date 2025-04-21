package com.shaluo.dbbikes.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "current_station")
public class CurrentStation {

    @Id
    private Integer number; // 站点编号作为主键

    private String name; // 🆕 新增 - 站点名称
    private String address; // 🆕 新增 - 地址
    private String contractName; // 🆕 新增 - 所属城市或地区

    private String status;
//    private LocalDateTime lastUpdate;
    private Boolean connected;
    private Boolean overflow;
    private Boolean banking;
    private Boolean bonus;

    private Double latitude;
    private Double longitude;

    private Integer availableBikes;
    private Integer availableBikeStands;
    private Integer capacity;
    private Integer mechanicalBikes;
    private Integer electricalBikes;

    private LocalDateTime recordedAt;

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public Boolean getConnected() {
        return connected;
    }

    public void setConnected(Boolean connected) {
        this.connected = connected;
    }

    public Boolean getOverflow() {
        return overflow;
    }

    public void setOverflow(Boolean overflow) {
        this.overflow = overflow;
    }

    public Boolean getBanking() {
        return banking;
    }

    public void setBanking(Boolean banking) {
        this.banking = banking;
    }

    public Boolean getBonus() {
        return bonus;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContractName() {
        return contractName;
    }

    public void setContractName(String contractName) {
        this.contractName = contractName;
    }

    public void setBonus(Boolean bonus) {
        this.bonus = bonus;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
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

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getMechanicalBikes() {
        return mechanicalBikes;
    }

    public void setMechanicalBikes(Integer mechanicalBikes) {
        this.mechanicalBikes = mechanicalBikes;
    }

    public Integer getElectricalBikes() {
        return electricalBikes;
    }

    public void setElectricalBikes(Integer electricalBikes) {
        this.electricalBikes = electricalBikes;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }
}
