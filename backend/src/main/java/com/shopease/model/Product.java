package com.shopease.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
public class Product {
public String getName() {
    return name;
}

public String getDescription() {
    return description;
}

public Double getPrice() {
    return price;
}

public Integer getStockQuantity() {
    return stockQuantity;
}

public String getImageUrl() {
    return imageUrl;
}

public Category getCategory() {
    return category;
}
