package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.converter.JsonListConverter;
import ge.evstore.ev_store.entity.*;
import ge.evstore.ev_store.exception.IsParentCategoryException;
import ge.evstore.ev_store.repository.CategoryRepository;
import ge.evstore.ev_store.repository.MaxPriceSaverRepository;
import ge.evstore.ev_store.repository.OrderRepository;
import ge.evstore.ev_store.repository.ProductRepository;
import ge.evstore.ev_store.request.ProductRequest;
import ge.evstore.ev_store.response.ImageSaveResponse;
import ge.evstore.ev_store.response.OrderHistoryResponse;
import ge.evstore.ev_store.service.interf.AdminService;
import ge.evstore.ev_store.service.interf.ImageService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final MaxPriceSaverRepository maxPriceSaverRepository;
    private final ImageService imageService;
    private final JsonListConverter jsonListConverter;
    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public Product addProduct(final ProductRequest productRequest, final String accessToken) throws AccessDeniedException {
        log.info("Adding new product: {}", productRequest);
        final List<MaxPriceEasySaver> maxPriceSaver = maxPriceSaverRepository.findAll();
        if (maxPriceSaver.isEmpty()) {
            final MaxPriceEasySaver maxPriceEasySaver = new MaxPriceEasySaver();
            maxPriceEasySaver.setMaxPrice(productRequest.getPrice());
            maxPriceSaverRepository.save(maxPriceEasySaver);
            log.info("Max price created: {}", maxPriceEasySaver.getMaxPrice());
        } else {
            final MaxPriceEasySaver maxPriceEasySaver = maxPriceSaver.get(0);
            if (productRequest.getPrice() > maxPriceEasySaver.getMaxPrice()) {
                maxPriceEasySaver.setMaxPrice(productRequest.getPrice());
                maxPriceSaverRepository.save(maxPriceEasySaver);
                log.info("Max price updated: {}", maxPriceEasySaver.getMaxPrice());
            }
        }

        final List<Long> imageIds = productRequest.getImageIds();
        String imageIdsColumnValue = null;
        if (imageIds != null && !imageIds.isEmpty()) {
            imageIdsColumnValue = jsonListConverter.convertToDatabaseColumn(imageIds);
        }
        final Product product = Product.fromProductRequest(productRequest);
        product.setCategory(categoryRepository.findById(productRequest.getCategoryId()).orElse(null));
        product.setImageIds(imageIdsColumnValue);
        return productRepository.save(product);
    }


    @Override
    public Product getProductById(final Long id, final String accessToken) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Product updateProduct(final Long id, final ProductRequest productRequest, final String accessToken) {
        log.info("Updating product -> id: {} data: {}", id, productRequest);
        return productRepository.findById(id)
                .map(existingProduct -> {
                    final Product updatedProduct = Product.fromProductRequest(productRequest);
                    updatedProduct.setImageIds(jsonListConverter.convertToDatabaseColumn(productRequest.getImageIds()));
                    existingProduct.update(updatedProduct);
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
        log.info("Adding category: {}", name);
        final AtomicReference<Category> result = new AtomicReference<>();
        if (parentCategoryId == null) {
            final Category category = new Category();
            category.setName(name);
            category.setDescription(description);
            category.setParentCategory(null);
            categoryRepository.save(category);
            result.set(category);
            log.info("Category created: {} with null as parent category", category);
        } else {
            categoryRepository.findById(parentCategoryId).ifPresent(parent -> {
                final Category child = new Category();
                child.setName(name);
                child.setDescription(description);
                child.setParentCategory(parent);
                parent.getChildren().add(child);
                categoryRepository.save(parent); // cascading will persist the new child
                categoryRepository.save(child);
                result.set(child);
                log.info("Category updated: {} with {} as parent category", child, parent);
            });
        }
        return result.get();
    }

    @Override
    @Transactional
    public Category updateCategory(final Long id, final String name, final String description, final String accessToken) {
        return categoryRepository.findById(id)
                .map(category1 -> {
                    if (name != null && !name.isEmpty()) {
                        category1.setName(name);
                    }
                    if (description != null && !description.isEmpty()) {
                        category1.setDescription(description);
                    }
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

    @Override
    public List<ImageSaveResponse> saveImages(final MultipartFile[] images, final String accessToken) throws IOException {
        log.info("Saving {} images", images.length);
        final List<ImageSaveResponse> response = new ArrayList<>();
        for (final MultipartFile image : images) {
            response.add(imageService.saveImage(image));
        }
        return response;
    }

    @Override
    @Transactional
    public OrderHistoryResponse updateOrderStatus(final OrderStatus orderStatus, final Long orderId, final String accessToken) {
        log.info("Updating order status for orderId:{} and new status:{}", orderId, orderStatus);
        final Optional<Order> byId = orderRepository.findById(orderId);
        if (byId.isEmpty()) {
            log.error("Order with ID {} not found", orderId);
            throw new EntityNotFoundException("Order not found for id: " + orderId);
        }
        final Order order = byId.get();
        order.setStatus(orderStatus);
        orderRepository.save(order);
        log.info("Order status updated");
        return OrderHistoryResponse.createFrom(order);
    }
}
