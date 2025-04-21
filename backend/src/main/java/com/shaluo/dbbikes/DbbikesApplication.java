package com.shaluo.dbbikes;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class DbbikesApplication {

	public static void main(String[] args) {

		// 加载 .env 文件
		Dotenv dotenv = Dotenv.configure().load();

		// 将变量设置到系统属性中，Spring Boot 才能识别 ${}
		System.setProperty("DB_HOST", dotenv.get("DB_HOST"));
		System.setProperty("DB_PORT", dotenv.get("DB_PORT"));
		System.setProperty("DB_NAME", dotenv.get("DB_NAME"));
		System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));

		System.setProperty("openweather.api.key", dotenv.get("OPENWEATHER_API_KEY"));

		System.setProperty("jcdecaux.api.key", dotenv.get("JCDECAUX_API_KEY"));
		SpringApplication.run(DbbikesApplication.class, args);
	}

}
