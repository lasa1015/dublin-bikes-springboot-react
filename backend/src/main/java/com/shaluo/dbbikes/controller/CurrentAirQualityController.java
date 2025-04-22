package com.shaluo.dbbikes.controller;

import com.shaluo.dbbikes.model.CurrentAirQuality;
import com.shaluo.dbbikes.repository.AirQualityRepository;
import org.springframework.web.bind.annotation.*;

// @RestController 是 @Controller + @ResponseBody，表示这个类是一个 “REST 风格的控制器”。
// 这个类的所有方法返回的内容都应该直接作为 HTTP 响应体返回，而不是跳转页面。
// 其他类型的控制器有： @Controller 用于页面跳转（MVC 模式），@ControllerAdvice 用于统一异常处理 / 拦截控制器逻辑 等

// @RequestMapping("/api/airquality") 给整个控制器类设置一个统一的请求路径前缀，类里的所有接口地址都从 /api/airquality 开头
// 最终组成的完整请求 URL： http://后端服务器地址:端口号 + 控制器路径 + 方法路径
@RestController
@RequestMapping("/api/airquality")
public class CurrentAirQualityController {

    // 字段注入写起来简单，但官方推荐构造器注入
    // @autowired 不能用于 final 字段, 不方便写单元测试,不容易发现依赖
    // final 的意思是这个字段一旦被赋值之后，就不能再改了, 保证注入的依赖只赋值一次（只能在构造函数里赋值）。
    // 也可以不写final，但失去了保护
    private final AirQualityRepository airQualityRepository;

    // 推荐方式：构造器注入
    public CurrentAirQualityController(AirQualityRepository airQualityRepository) {
        this.airQualityRepository = airQualityRepository;
    }




    // GetMapping("/xxx") 请求方式GET,用来查询数据
    // 获取最新的空气质量数据
    @GetMapping("/latest")  //方法对应的具体接口路径
    public CurrentAirQuality getLatestAirQuality() {

        // findAll() 是 JpaRepository 自带的方法 会从数据库中查出所有记录，并用 List<T> 形式返回
        return airQualityRepository.findAll().get(0);
    }
}
