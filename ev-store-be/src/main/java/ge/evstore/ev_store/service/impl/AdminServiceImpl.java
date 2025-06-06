package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.entity.MaxPriceEasySaver;
import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.exception.IsParentCategoryException;
import ge.evstore.ev_store.repository.CategoryRepository;
import ge.evstore.ev_store.repository.MaxPriceSaverRepository;
import ge.evstore.ev_store.repository.ProductRepository;
import ge.evstore.ev_store.service.interf.AdminService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
@Service
public class AdminServiceImpl implements AdminService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final MaxPriceSaverRepository maxPriceSaverRepository;

    public AdminServiceImpl(final ProductRepository productRepository, final CategoryRepository categoryRepository, final MaxPriceSaverRepository maxPriceSaverRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.maxPriceSaverRepository = maxPriceSaverRepository;
    }

    @Override
    @Transactional
    public Product addProduct(final Product product, final String accessToken) throws AccessDeniedException {
        final List<MaxPriceEasySaver> maxPriceSaver = maxPriceSaverRepository.findAll();
        if (maxPriceSaver.isEmpty()) {
            final MaxPriceEasySaver maxPriceEasySaver = new MaxPriceEasySaver();
            maxPriceEasySaver.setMaxPrice(product.getPrice());
            maxPriceSaverRepository.save(maxPriceEasySaver);
        } else {
            final MaxPriceEasySaver maxPriceEasySaver = maxPriceSaver.get(0);
            if (product.getPrice() > maxPriceEasySaver.getMaxPrice()) {
                maxPriceEasySaver.setMaxPrice(product.getPrice());
                maxPriceSaverRepository.save(maxPriceEasySaver);
            }
        }
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
    public Category addCategory(final String name, final String description, final Long parentCategoryId, final String accessToken) {
        final AtomicReference<Category> result = new AtomicReference<>();
        if (parentCategoryId == null) {
            final Category category = new Category();
            category.setName(name);
            category.setDescription(description);
            category.setParentCategory(null);
            categoryRepository.save(category);
            result.set(category);
        } else {
            categoryRepository.findById(parentCategoryId).ifPresent(parent -> {
                final Category child = new Category();
                child.setName(name);
                child.setDescription(description);
                child.setParentCategory(parent);
                parent.getChildren().add(child);
                categoryRepository.save(parent); // cascading will persist the new child
                result.set(child);
            });
        }
        return result.get();
    }

    @Override
    @Transactional
    public Category updateCategory(final Long id, final String name, final String description, final String accessToken) {
        return categoryRepository.findById(id)
                .map(category1 -> {
                    category1.setName(name);
                    category1.setDescription(description);
                    return categoryRepository.save(category1);
                })
                .orElseThrow(() -> new EntityNotFoundException("Category with ID " + id + " not found"));
    }

    @Override
    @Transactional
    public void deleteCategory(final Long id, final String accessToken) {
        final Optional<Category> category = categoryRepository.findById(id);
        if (category.isEmpty()) {
            return;
        }
        final List<Category> children = category.get().getChildren();
        if (!children.isEmpty()) {
            log.error("Category with given id is parent category for categories:{}. Delete child categories first", children);
            throw new IsParentCategoryException(String.format("Category with given id is parent category for categories:%s. Delete child categories first", children));
        }
        categoryRepository.deleteById(id);
    }
}
