package com.shaluo.dbbikes.repository;

import com.shaluo.dbbikes.model.CurrentWeatherForecast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface CurrentWeatherForecastRepository extends JpaRepository<CurrentWeatherForecast, Long> {


    // @Modifying 默认情况下，Spring JPA 的 @Query 只支持查询（select）。
    // 如果你想执行 更新、删除、插入或 TRUNCATE 等改变数据库状态的操作，就必须加上 @Modifying。

    // @Transactional : TRUNCATE 是一种会改变数据库状态的操作，为了保证执行完整性，必须放在事务中执行。
    // 加了这个注解，Spring 会在这个方法开始前自动开启事务，结束后自动提交。

    // @Query(...) : 告诉 Spring Data JPA，这个方法不是用方法名自动推导的，而是我们自己写的 SQL
    // value = "TRUNCATE TABLE current_weather_forecast" 就是你想执行的 SQL。
    // nativeQuery = true 表示这是原生 SQL，不是 JPQL（Java Persistence Query Language）。
    @Modifying
    @Transactional
    @Query(value = "TRUNCATE TABLE current_weather_forecast", nativeQuery = true)
    void truncateTable();
}
