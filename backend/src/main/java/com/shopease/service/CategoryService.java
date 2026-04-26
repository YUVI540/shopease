package com.shopease.service;

import com.shopease.exception.ResourceNotFoundException;
import com.shopease.model.Category;
import com.shopease.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    public Category createCategory(Category category) {
        if (categoryRepository.findByNameIgnoreCase(category.getName()).isPresent()) {
            throw new IllegalArgumentException("Category '" + category.getName() + "' already exists");
        }
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category details) {
        Category category = getCategoryById(id);
        category.setName(details.getName());
        category.setDescription(details.getDescription());
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}
