package com.shaluo.dbbikes.controller;

import com.shaluo.dbbikes.model.CurrentStation;
import com.shaluo.dbbikes.repository.CurrentStationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/current-bike")
public class CurrentStationController {

    private final CurrentStationRepository bikeRepository;

    public CurrentStationController(CurrentStationRepository bikeRepository) {
        this.bikeRepository = bikeRepository;
    }



    @GetMapping("/all")
    public List<CurrentStation> getAllStations() {
        return bikeRepository.findAll();
    }


}
