package com.shaluo.dbbikes;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

// @EnableScheduling 会让 Spring Boot 扫描并启用所有带有 @Scheduled 注解的方法。
// @EnableScheduling 本质上是一个开关，它做了两件事：
// 开启了定时任务调度线程池; 去 Spring 容器中找所有带有 @Scheduled 注解的方法，并注册调度任务
// 如果没有 @EnableScheduling, Spring 根本就不会启动调度器，你的方法也就不会被扫描、不会被定时调用。
@EnableScheduling
@SpringBootApplication // 创建一个 Spring Boot 应用，启用自动配置、组件扫描，并从这个类启动整个项目。
public class DbbikesApplication {

	public static void main(String[] args) {

		// 加载 .env 文件
		Dotenv dotenv = Dotenv.configure().directory("./backend") .load();

		// 将变量设置到系统属性中，Spring Boot 才能识别 ${}
		System.setProperty("DB_HOST", dotenv.get("DB_HOST"));
		System.setProperty("DB_PORT", dotenv.get("DB_PORT"));
		System.setProperty("DB_NAME", dotenv.get("DB_NAME"));
		System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));

		// 从.env中获取 openweather 的 api
		System.setProperty("openweather.api.key", dotenv.get("OPENWEATHER_API_KEY"));

		// 从.env中获取 jcdecaux 的 api
		System.setProperty("jcdecaux.api.key", dotenv.get("JCDECAUX_API_KEY"));

		// 启动 Spring Boot 应用的标准入口，会初始化 Spring 容器、执行自动配置、启动 Web 服务、加载 Bean 等，是整个项目“动起来”的核心命令。
		// args 接收你在启动时传入的命令行参数，例如：java -jar app.jar --server.port=8085
		// Spring Boot 会自动识别这些参数，并加载到 Environment 中（可以用 @Value、application.properties 访问）
		SpringApplication.run(DbbikesApplication.class, args);
	}

}
