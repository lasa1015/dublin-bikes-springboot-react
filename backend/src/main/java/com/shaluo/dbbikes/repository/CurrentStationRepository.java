package com.shaluo.dbbikes.repository;

import com.shaluo.dbbikes.model.CurrentStation;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CurrentStationRepository extends JpaRepository<CurrentStation, Integer> {

    // JPA 提供的“方法名自动生成 SQL 查询”的功能，它会根据方法名自动生成对应的 SQL 语句
    // 底层相当于执行 SELECT * FROM current_station WHERE number = ? LIMIT 1;
    // Optional<T> 是一个容器对象，它可能有值，也可能没有值，用来避免空指针异常（NullPointerException）
    // 这个查询 findByNumber(int number) 有可能查不到对应的站点，它不会报错，也不会返回 null，而是返回一个空容器（Optional.empty()），让你可以用 .isPresent() 或 .orElse(...) 安全地判断后续逻辑。
    Optional<CurrentStation> findByNumber(int number);

}
