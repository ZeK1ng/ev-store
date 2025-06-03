package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.entity.Product;

public interface ProductService {
    Product getProductById(Long productId);

    Double getOverAllMaxPrice();
}
