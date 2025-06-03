package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.entity.Product;

import java.nio.file.AccessDeniedException;
import java.util.List;

public interface AdminService {

    // Product operations
    Product addProduct(Product product, String accessToken) throws AccessDeniedException;

    Product getProductById(Long id, String accessToken);

    Product updateProduct(Long id, Product product, String accessToken);

    void deleteProduct(Long id, String accessToken);

    List<Product> getAllProducts(String accessToken);

    Product updateProductStock(Long id, int stockAmount, String accessToken);

    // Category operations
    Category addCategory(Category category, String accessToken);

    Category updateCategory(Long id, Category category, String accessToken);

    void deleteCategory(Long id, String accessToken);
}
