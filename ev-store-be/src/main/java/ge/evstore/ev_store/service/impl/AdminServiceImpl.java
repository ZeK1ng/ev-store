package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.exception.IsParentCategoryException;
import ge.evstore.ev_store.repository.CategoryRepository;
import ge.evstore.ev_store.repository.ProductRepository;
import ge.evstore.ev_store.service.interf.AdminService;
import ge.evstore.ev_store.service.interf.AuthService;
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
    private final UserDetailsServiceImpl userDetailsService;
    private final AuthService authService;

    public AdminServiceImpl(final ProductRepository productRepository, final CategoryRepository categoryRepository, final UserDetailsServiceImpl userDetailsService, final AuthService authService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userDetailsService = userDetailsService;
        this.authService = authService;
    }

    @Override
    @Transactional
    public Product addProduct(final Product product, final String accessToken, final String refreshToken) throws AccessDeniedException {
        return productRepository.save(product);
    }


    @Override
    public Product getProductById(final Integer id, final String accessToken, final String refreshToken) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Product updateProduct(final Integer id, final Product product, final String accessToken, final String refreshToken) {
        return productRepository.findById(id)
                .map(existingProduct -> {
                    existingProduct.update(product);
                    return productRepository.save(existingProduct);
                })
                .orElse(null);
    }

    @Override
    @Transactional
    public void deleteProduct(final Integer id, final String accessToken, final String refreshToken) {
        productRepository.deleteById(id);
    }

    @Override
    public List<Product> getAllProducts(final String accessToken, final String refreshToken) {
        return productRepository.findAll();
    }

    @Override
    @Transactional
    public Product updateProductStock(final Integer id, final int stockAmount, final String accessToken, final String refreshToken) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setStockAmount(stockAmount);
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new EntityNotFoundException("Product with ID " + id + " not found"));
    }

    @Override
    @Transactional
    public Category addCategory(final Category category, final String accessToken, final String refreshToken) {
        return categoryRepository.save(category);
    }

    @Override
    public Category getCategoryById(final Integer id, final String accessToken, final String refreshToken) {
        return categoryRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Category updateCategory(final Integer id, final Category category, final String accessToken, final String refreshToken) {
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
    public void deleteCategory(final Integer id, final String accessToken, final String refreshToken) {
        final List<Category> byParentCategory = categoryRepository.findByParentCategory(id);
        if (!byParentCategory.isEmpty()) {
            log.error("Category with given id is parent category for categories:{}. Delete child categories first", byParentCategory);
            throw new IsParentCategoryException(String.format("Category with given id is parent category for categories:%s. Delete child categories first", byParentCategory));
        }
        categoryRepository.deleteById(id);
    }

    @Override
    public List<Category> getAllCategories(final String accessToken, final String refreshToken) {
        return List.of();
    }

    @Override
    public String getFullCategoryPath(final Integer categoryId, final String accessToken, final String refreshToken) {
        Category category = this.getCategoryById(categoryId, accessToken, refreshToken);
        if (category == null) {
            return null;
        }
        final List<String> path = new ArrayList<>();
        while (category.getParentCategory() != null) {
            path.add(category.getName());
            category = this.getCategoryById(category.getParentCategory(), accessToken, refreshToken);
        }
        Collections.reverse(path);
        return String.join(" -> ", path);
    }
}
