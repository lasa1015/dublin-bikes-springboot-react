package com.shaluo.dbbikes;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DbbikesApplication {

	public static void main(String[] args) {

		// 加载 .env 文件
		Dotenv dotenv = Dotenv.configure().load();

		// 将变量设置到系统属性中，Spring Boot 才能识别 ${}
		System.setProperty("DB_HOST", dotenv.get("DB_HOST"));
		System.setProperty("DB_PORT", dotenv.get("DB_PORT"));
		System.setProperty("DB_NAME", dotenv.get("DB_NAME"));
		System.setProperty("DB_USERNAME", dotenv.get("DB_USER"));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));


		SpringApplication.run(DbbikesApplication.class, args);
	}

}
