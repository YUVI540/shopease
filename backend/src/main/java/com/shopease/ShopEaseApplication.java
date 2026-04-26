package com.shopease;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ShopEaseApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShopEaseApplication.class, args);
        System.out.println("✅ ShopEase Backend is running at http://localhost:8080");
    }
}
