package com.shopease.service;

import com.shopease.exception.ResourceNotFoundException;
import com.shopease.model.Product;
import com.shopease.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    public List<Product> getInStockProducts() {
        return productRepository.findByStockQuantityGreaterThan(0);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product details) {
        Product product = getProductById(id);
        product.setName(details.getName());
        product.setDescription(details.getDescription());
        product.setPrice(details.getPrice());
        product.setStockQuantity(details.getStockQuantity());
        product.setImageUrl(details.getImageUrl());
        product.setCategory(details.getCategory());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    // Reduce stock when order is placed
    public void reduceStock(Long productId, int quantity) {
        Product product = getProductById(productId);
        if (product.getStockQuantity() < quantity) {
            throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
        }
        product.setStockQuantity(product.getStockQuantity() - quantity);
        productRepository.save(product);
    }
}
