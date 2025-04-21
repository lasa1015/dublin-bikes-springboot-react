package com.shaluo.dbbikes.repository;

import com.shaluo.dbbikes.model.CurrentStation;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface CurrentStationRepository extends JpaRepository<CurrentStation, Integer> {

    @Modifying
    @Transactional
    @Query(value = "TRUNCATE TABLE current_station", nativeQuery = true)
    void truncateTable();
}
