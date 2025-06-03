package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.MaxPriceEasySaver;
import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.repository.MaxPriceSaverRepository;
import ge.evstore.ev_store.repository.ProductRepository;
import ge.evstore.ev_store.service.interf.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
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
        return product.orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));
    }

    @Override
    public Double getOverAllMaxPrice() {
        final List<MaxPriceEasySaver> all = maxPriceSaverRepository.findAll();
        if (all.isEmpty()) {
            return 0.0;
        }
        final Double maxPrice = all.get(0).getMaxPrice();
        return Math.ceil(maxPrice);
    }
}
