package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.response.MaxPriceResponse;
import ge.evstore.ev_store.response.ProductResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {
    ProductResponse getProductResponseById(Long productId);

    Product getProductById(Long productId);

    MaxPriceResponse getOverAllMaxPrice();

    List<ProductResponse> getProductsByIds(List<Long> productIds);

    Page<ProductResponse> getAllProducts(int page, int size, String sortBy, String direction, String name, String categoryId, Double minPrice, Double maxPrice, Boolean inStock, Boolean isPopular, Long productId);
}
