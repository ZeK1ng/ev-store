package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.MaxPriceEasySaver;
import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.exception.ProductNotFoundException;
import ge.evstore.ev_store.repository.MaxPriceSaverRepository;
import ge.evstore.ev_store.repository.ProductRepository;
import ge.evstore.ev_store.response.MaxPriceResponse;
import ge.evstore.ev_store.service.interf.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final MaxPriceSaverRepository maxPriceSaverRepository;

    @Autowired
    public ProductServiceImpl(final ProductRepository productRepository, final MaxPriceSaverRepository maxPriceSaverRepository) {
        this.productRepository = productRepository;
        this.maxPriceSaverRepository = maxPriceSaverRepository;
    }

    @Override
    public Product getProductById(final Long productId) {
        final Optional<Product> product = productRepository.findById(productId);
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
    public List<Product> getProductsByIds(final List<Long> productIds) {
        return productRepository.findAllById(productIds);
    }

    @Override
    public Page<Product> getAllProducts(final int page, final int size, final String sortBy, final String direction, final String name, final Long categoryId, final Double minPrice, final Double maxPrice, final Boolean inStock, final Boolean isPopular) {
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
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("category").get("id"), categoryId));
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

        return productRepository.findAll(spec, pageable);
    }

}
