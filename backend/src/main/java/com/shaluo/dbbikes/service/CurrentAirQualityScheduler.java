package com.shaluo.dbbikes.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shaluo.dbbikes.model.CurrentAirQuality;
import com.shaluo.dbbikes.repository.AirQualityRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

// 就算程序入口没加 @EnableScheduling，这个类本身还是会被注册成一个 Spring Bean。
// 但它里面用 @Scheduled 标记的方法不会被自动调用，因为 Spring 的调度系统没有启动。
@Component
public class CurrentAirQualityScheduler {



    private static final Logger logger = LoggerFactory.getLogger(CurrentAirQualityScheduler.class);

    private final AirQualityRepository airQualityRepository;

    // RestTemplate 是 Spring 提供的一个 HTTP 客户端工具，用来从远程 API 获取数据。
    // 你可以用它发送 GET、POST 请求，拿到 JSON 响应
    private final RestTemplate restTemplate;

    // ObjectMapper 是 Spring 常用的 JSON 解析工具，来自 Jackson 库
    // 用来把 JSON 字符串转成 Java 对象，或者反过来把 Java 对象转成 JSON 的工具。
    private final ObjectMapper objectMapper;

    // @Value 用来把 配置文件（比如 application.properties 或 .env）中的值注入到 Java 类中的变量
    // 从 Spring Boot 配置源中读取名为 openweather.api.key 的配置值，并注入到变量 apiKey 中。
    @Value("${openweather.api.key}")
    private String apiKey;

    public CurrentAirQualityScheduler(AirQualityRepository airQualityRepository) {

        // 在 Spring 项目中，Repository 类就是专门用来 在多个地方读写数据库 的，比如：
        // 在 Controller 中读取用户请求时要查数据库, 在 Scheduler 中定时抓数据时也要保存进数据库。
        // 只要和数据库有交互，不管是“读数据”还是“写数据”，都必须通过 Repository 接口来完成。
        this.airQualityRepository = airQualityRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    //  60 分钟 执行一次这个方法。
    @Scheduled(fixedRate = 3600000)
    public void fetchAirQualityData() {

        try {

            // 构造 OpenWeather 的空气质量 API URL，包含经纬度和 API key
            String url = "http://api.openweathermap.org/data/2.5/air_pollution?lat=53.349805&lon=-6.26031&appid=" + apiKey;

            // 使用 RestTemplate 发送 HTTP GET 请求，获取 API 响应（JSON 格式字符串）
            // 用 GET 请求访问 url，然后把返回内容当成 String 来接收（也就是 JSON 字符串）
            // 第二个参数 String.class: 指定你希望 RestTemplate 把响应解析成哪种 Java 类型
            String response = restTemplate.getForObject(url, String.class);

            /*
                {
                    "coord": {
                        "lon": -6.2603,
                        "lat": 53.3498
                    },
                    "list": [
                        {
                            "main": {
                                "aqi": 2
                            },
                            "components": {
                                "co": 134.17,
                                "no": 0.04,
                                "no2": 0.45,
                                "o3": 93.25,
                                "so2": 0.38,
                                "pm2_5": 0.5,
                                "pm10": 1.12,
                                "nh3": 0.72
                            },
                            "dt": 1745316824
                        }
                    ]
                }
             */

            // 上一步收到的是一个 String response，不能直接 .get("属性")，因为字符串是不可操作的。
            // 使用 ObjectMapper 将 JSON 字符串解析为 JsonNode 对象（树状结构，像 Map），然后才能一层一层地读
            JsonNode root = objectMapper.readTree(response);

            // 获取 JSON 中 list 数组的第一个元素（通常 API 返回的都是 list 包含一组数据）
            JsonNode list = root.get("list").get(0);

            // 从 list 中获取 main 节点，里面包含 AQI（空气质量指数）
            JsonNode main = list.get("main");

            // 获取污染物浓度信息的 components 节点（pm2.5、pm10 等）
            JsonNode components = list.get("components");

            // 创建一个 CurrentAirQuality 对象，准备用来保存进数据库
            CurrentAirQuality aq = new CurrentAirQuality();

            // 设置记录时间为当前时间（抓取的时间）
            // LocalDateTime.now() 是 Java 8 提供的时间 API，用来获取当前的本地日期和时间（不包含时区信息）。
            aq.setRecordedAt(LocalDateTime.now());

            // 设置地理位置（经纬度）
            aq.setLatitude(53.349805);
            aq.setLongitude(-6.26031);

            // 从 JSON 中提取 AQI 数值并设置到实体对象中
            // asInt() 是 Jackson 的 JsonNode 类 提供的方法，用来：
            // 把当前的 JSON 节点的值（一个 JsonNode 对象）解析成一个 int 类型。
            aq.setAqi(main.get("aqi").asInt());

            // 提取 pm2.5 和 pm10 的数值并设置到实体对象中
            // asDouble() 是 Jackson 的 JsonNode 提供的方法，用来把当前 JSON 节点的值（一个 JsonNode 对象） 解析成 double 类型的数值。
            aq.setPm25(components.get("pm2_5").asDouble());
            aq.setPm10(components.get("pm10").asDouble());

            // 为了只保留最新的数据，先清空数据库中旧的空气质量记录
            // .deleteAll() 是 Spring Data JPA 提供的自带方法,来自 JpaRepository
            airQualityRepository.deleteAll();

            // 保存当前最新的数据到数据库中。
            // .save() 也是 Spring Data JPA 自带的方法，来自 JpaRepository
            airQualityRepository.save(aq);

            // 控制台输出提示，说明数据保存成功
            logger.info("✅ air quality数据已经存入数据库");

        } catch (Exception e) {

            // 如果在抓取或解析过程中出错，打印错误信息到控制台
            logger.error("❌ Error fetching air quality: " + e.getMessage());
        }

    }
}
