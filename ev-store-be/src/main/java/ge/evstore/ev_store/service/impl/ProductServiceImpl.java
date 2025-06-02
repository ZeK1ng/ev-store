package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.repository.ProductRepository;
import ge.evstore.ev_store.service.interf.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    @Autowired
    public ProductServiceImpl(final ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Product getProductById(final Long productId) {
        final Optional<Product> product = productRepository.findById(productId);
        return product.orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));
    }
}
