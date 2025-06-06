package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.response.MaxPriceResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {
    Product getProductById(Long productId);

    MaxPriceResponse getOverAllMaxPrice();

    List<Product> getProductsByIds(List<Long> productIds);

    Page<Product> getAllProducts(int page, int size, String sortBy, String direction, String name, Long categoryId, Double minPrice, Double maxPrice, Boolean inStock, Boolean isPopular);
}
