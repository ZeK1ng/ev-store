package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.repository.CategoryRepository;
import ge.evstore.ev_store.repository.ProductRepository;
import ge.evstore.ev_store.service.interf.AdminService;
import ge.evstore.ev_store.service.interf.AuthService;
import ge.evstore.ev_store.utils.JwtUtils;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.List;

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
    public Category addCategory(final Category category, final String accessToken, final String refreshToken) {
        return null;
    }

    @Override
    public Category getCategoryById(final Integer id, final String accessToken, final String refreshToken) {
        return null;
    }

    @Override
    public Category updateCategory(final Integer id, final Category category, final String accessToken, final String refreshToken) {
        return null;
    }

    @Override
    public void deleteCategory(final Integer id, final String accessToken, final String refreshToken) {

    }

    @Override
    public List<Category> getAllCategories(final String accessToken, final String refreshToken) {
        return List.of();
    }
}
