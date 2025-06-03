package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.exception.IsParentCategoryException;
import ge.evstore.ev_store.repository.CategoryRepository;
import ge.evstore.ev_store.repository.ProductRepository;
import ge.evstore.ev_store.service.interf.AdminService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
public class AdminServiceImpl implements AdminService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public AdminServiceImpl(final ProductRepository productRepository, final CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional
    public Product addProduct(final Product product, final String accessToken) throws AccessDeniedException {
        return productRepository.save(product);
    }


    @Override
    public Product getProductById(final Long id, final String accessToken) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Product updateProduct(final Long id, final Product product, final String accessToken) {
        return productRepository.findById(id)
                .map(existingProduct -> {
                    existingProduct.update(product);
                    return productRepository.save(existingProduct);
                })
                .orElse(null);
    }

    @Override
    @Transactional
    public void deleteProduct(final Long id, final String accessToken) {
        productRepository.deleteById(id);
    }

    @Override
    public List<Product> getAllProducts(final String accessToken) {
        return productRepository.findAll();
    }

    @Override
    @Transactional
    public Product updateProductStock(final Long id, final int stockAmount, final String accessToken) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setStockAmount(stockAmount);
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new EntityNotFoundException("Product with ID " + id + " not found"));
    }

    @Override
    @Transactional
    public Category addCategory(final Category category, final String accessToken) {
        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public Category updateCategory(final Long id, final Category category, final String accessToken) {
        return categoryRepository.findById(id)
                .map(category1 -> {
                    category1.setParentCategory(category.getParentCategory());
                    category1.setName(category.getName());
                    category1.setDescription(category.getDescription());
                    return categoryRepository.save(category1);
                })
                .orElseThrow(() -> new EntityNotFoundException("Category with ID " + id + " not found"));
    }

    @Override
    @Transactional
    public void deleteCategory(final Long id, final String accessToken) {
        final List<Category> byParentCategory = categoryRepository.findByParentCategory(id);
        if (!byParentCategory.isEmpty()) {
            log.error("Category with given id is parent category for categories:{}. Delete child categories first", byParentCategory);
            throw new IsParentCategoryException(String.format("Category with given id is parent category for categories:%s. Delete child categories first", byParentCategory));
        }
        categoryRepository.deleteById(id);
    }
}
