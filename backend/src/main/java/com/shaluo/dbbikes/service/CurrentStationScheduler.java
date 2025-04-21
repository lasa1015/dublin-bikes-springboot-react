package com.shaluo.dbbikes.service;

import com.shaluo.dbbikes.model.CurrentStation;
import com.shaluo.dbbikes.repository.CurrentStationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;

@Service
public class CurrentStationScheduler {

    @Value("${jcdecaux.api.key}")
    private String apiKey;

    private final CurrentStationRepository bikeRepository;

    public CurrentStationScheduler(CurrentStationRepository bikeRepository) {
        this.bikeRepository = bikeRepository;
    }

    @Scheduled(fixedRate = 1800000) // 每 30 分钟抓一次（单位：毫秒）
    public void fetchStationData() {
        String url = "https://api.jcdecaux.com/vls/v3/stations?contract=Dublin&apiKey=" + apiKey;

        RestTemplate restTemplate = new RestTemplate();
        List<Map<String, Object>> stations = restTemplate.getForObject(url, List.class);

        if (stations == null || stations.isEmpty()) return;

        bikeRepository.truncateTable(); // 快速清空旧数据

        for (Map<String, Object> station : stations) {
            CurrentStation bike = new CurrentStation();

            bike.setNumber(((Number) station.get("number")).intValue());
            bike.setStatus((String) station.get("status"));

            bike.setName((String) station.get("name"));
            bike.setAddress((String) station.get("address"));
            bike.setContractName((String) station.get("contractName"));


            bike.setConnected((Boolean) station.get("connected"));
            bike.setOverflow((Boolean) station.get("overflow"));
            bike.setBanking((Boolean) station.get("banking"));
            bike.setBonus((Boolean) station.get("bonus"));

            Map<String, Object> position = (Map<String, Object>) station.get("position");
            bike.setLatitude(((Number) position.get("latitude")).doubleValue());
            bike.setLongitude(((Number) position.get("longitude")).doubleValue());

            Map<String, Object> totalStands = (Map<String, Object>) station.get("totalStands");
            Map<String, Object> availabilities = (Map<String, Object>) totalStands.get("availabilities");

            bike.setAvailableBikes(((Number) availabilities.get("bikes")).intValue());
            bike.setAvailableBikeStands(((Number) availabilities.get("stands")).intValue());
            bike.setCapacity(((Number) totalStands.get("capacity")).intValue());
            bike.setMechanicalBikes(((Number) availabilities.get("mechanicalBikes")).intValue());
            bike.setElectricalBikes(((Number) availabilities.get("electricalBikes")).intValue());

            bike.setRecordedAt(LocalDateTime.now());

            bikeRepository.save(bike);


        }

        System.out.println("✅station数据已经存入数据库");
    }
}
