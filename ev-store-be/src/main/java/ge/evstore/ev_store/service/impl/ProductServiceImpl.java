package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.converter.JsonListConverter;
import ge.evstore.ev_store.entity.MaxPriceEasySaver;
import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.exception.ProductNotFoundException;
import ge.evstore.ev_store.repository.MaxPriceSaverRepository;
import ge.evstore.ev_store.repository.ProductRepository;
import ge.evstore.ev_store.response.MaxPriceResponse;
import ge.evstore.ev_store.response.ProductResponse;
import ge.evstore.ev_store.service.interf.CategoryService;
import ge.evstore.ev_store.service.interf.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final MaxPriceSaverRepository maxPriceSaverRepository;
    private final CategoryService categoryService;
    private final JsonListConverter jsonListConverter;

    @Override
    public ProductResponse getProductResponseById(final Long productId) {
        final Optional<Product> product = productRepository.findById(productId);
        log.info("Getting product {}", productId);
        if (product.isEmpty()) {
            throw new ProductNotFoundException("Product not found with ID: " + productId);
        }
        final List<Long> imageIds = jsonListConverter.convertToEntityAttribute(product.get().getImageIds());
        final ProductResponse from = ProductResponse.from(product.get(), imageIds);
        from.setCategoryId(product.get().getCategory().getId());
        return from;
    }

    @Override
    public Product getProductById(final Long productId) {
        final Optional<Product> product = productRepository.findById(productId);
        log.info("Getting product {}", productId);
        return product.orElseThrow(() -> new ProductNotFoundException("Product not found with ID: " + productId));
    }

    @Override
    public MaxPriceResponse getOverAllMaxPrice() {
        final List<MaxPriceEasySaver> all = maxPriceSaverRepository.findAll();
        if (all.isEmpty()) {
            return new MaxPriceResponse(0.0);
        }
        final Double maxPrice = all.get(0).getMaxPrice();
        return new MaxPriceResponse(Math.ceil(maxPrice));
    }

    @Override
    public List<ProductResponse> getProductsByIds(final List<Long> productIds) {
        final List<Product> allById = productRepository.findAllById(productIds);
        return allById.stream().map(product -> {
            final List<Long> imageIds = jsonListConverter.convertToEntityAttribute(product.getImageIds());
            return ProductResponse.from(product, imageIds);
        }).toList();
    }

    @Override
    public Page<ProductResponse> getAllProducts(final int page, final int size, final String sortBy, final String direction, final String name, final Long categoryId, final Double minPrice, final Double maxPrice, final Boolean inStock, final Boolean isPopular) {
        log.info("getAllProducts called with: page={}, size={}, sortBy:{}, direction: {}, name: {}, caregoryId:{}, minPrice:{}, maxPrice:{}, inStock:{}, isPopular:{}", page, size, sortBy, direction, name, categoryId, minPrice, maxPrice, inStock, isPopular);
        final Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        final Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Product> spec = Specification.where(null);

        if (name != null && !name.isBlank()) {
            final String pattern = "%" + name.toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("nameENG")), pattern),
                    cb.like(cb.lower(root.get("nameGE")), pattern),
                    cb.like(cb.lower(root.get("nameRUS")), pattern)
            ));
        }

        if (categoryId != null) {
            final Set<Long> categoryIds = categoryService.getDescendantCategoryIds(categoryId);
            spec = spec.and((root, query, cb) ->
                    root.get("category").get("id").in(categoryIds));
        }

        if (minPrice != null) {
            spec = spec.and((root, query, cb) ->
                    cb.ge(root.get("price"), minPrice));
        }

        if (maxPrice != null) {
            spec = spec.and((root, query, cb) ->
                    cb.le(root.get("price"), maxPrice));
        }

        if (inStock != null && inStock) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThan(root.get("stock"), 0));
        }
        if (isPopular != null && isPopular) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("isPopular"), true));
        }

        final Page<Product> all = productRepository.findAll(spec, pageable);
        final List<Product> content = all.getContent();
        final List<ProductResponse> productResponses = content.stream().map(product -> {
            final List<Long> imageIds = jsonListConverter.convertToEntityAttribute(product.getImageIds());
            return ProductResponse.from(product, imageIds);
        }).toList();
        return new PageImpl<>(productResponses, all.getPageable(), all.getTotalElements());
    }

}
