package com.shaluo.dbbikes.service;

import com.shaluo.dbbikes.model.CurrentStation;
import com.shaluo.dbbikes.repository.CurrentStationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

// Logger 和 LoggerFactory 来自 SLF4J 日志标准接口库，它不是 Spring 的一部分，但 Spring Boot 默认集成了它，
// 并且背后用的是 Logback 作为实际日志实现工具。所以你可以直接用，不需要自己导入依赖。
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class CurrentStationScheduler {

    @Value("${jcdecaux.api.key}")
    private String apiKey;

    private final CurrentStationRepository bikeRepository;

    // Logger 是用来记录日志的对象，
    // LoggerFactory 是用来创建 Logger 实例的工具类，会创建一个 “属于这个类” 的日志记录器，日志输出时会自动带上类名。
    private static final Logger logger = LoggerFactory.getLogger(CurrentStationScheduler.class);

    public CurrentStationScheduler(CurrentStationRepository bikeRepository) {
        this.bikeRepository = bikeRepository;
    }

    @Scheduled(fixedRate = 1800000) // 每 30 分钟抓一次（单位：毫秒）
    public void fetchStationData() {

        try {
            String url = "https://api.jcdecaux.com/vls/v3/stations?contract=Dublin&apiKey=" + apiKey;

            RestTemplate restTemplate = new RestTemplate();

            // 返回的数据是一个数组（List），数组里的每一个车站项是一个对象（Map）
            // 外层：List<...>，因为是数组，内层：Map<String, Object>，因为每个站点是一个键值对结构的对象
            // 拿到的是一个站点列表，每个站点是一个用字符串做 key 的 map（表示字段和值的关系）
            List<Map<String, Object>> stations = restTemplate.getForObject(url, List.class);

            if (stations == null) {
                logger.error("❌ JCDecaux 接口请求失败，返回 null");
                return;
            }
            if (stations.isEmpty()) {
                logger.warn("⚠️ JCDecaux 返回空列表（可能当前无可用站点）");
                return;
            }

            // 遍历站点，并更新
            for (Map<String, Object> station : stations) {

            /* 先从数据库查出已有记录，把它转成一个实体对象，在内存中修改这个对象，最后调用 save()，
            JPA 就会把这个对象自动映射并更新到数据库原有的位置。*/

                // 从 station 这个 Map 中读取 "number" 字段，并将它转换成 int 类型
                // Object 不能直接强转为 int，必须先转成 Number
                int number = ((Number) station.get("number")).intValue();


                // 从数据库中查找编号为 number 的站点，如果存在就返回这个bike对象；
                // 如果查不到，就创建一个新的 CurrentStation 实例（空壳），后面再填数据。
                CurrentStation bike = bikeRepository.findByNumber(number)
                        .orElse(new CurrentStation());

                bike.setNumber(number);
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

                // 把 bike 这个实体对象保存到数据库中。
                // 如果是新对象就执行 INSERT，如果是已有对象就执行 UPDATE。
                bikeRepository.save(bike);
            }

            logger.info("✅ station 数据已成功存入数据库，共 {} 条记录", stations.size());

        } catch (Exception e) {

            logger.error("❌ 抓取 JCDecaux 站点数据出错：{}", e.getMessage(), e);
        }
    }
}
