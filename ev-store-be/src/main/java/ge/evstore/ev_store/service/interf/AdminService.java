package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.entity.Product;

import java.nio.file.AccessDeniedException;
import java.util.List;

public interface AdminService {

    // Product operations
    Product addProduct(Product product, String accessToken, String refreshToken) throws AccessDeniedException;

    Product getProductById(Integer id, String accessToken, String refreshToken);

    Product updateProduct(Integer id, Product product, String accessToken, String refreshToken);

    void deleteProduct(Integer id, String accessToken, String refreshToken);

    List<Product> getAllProducts(String accessToken, String refreshToken);

    Product updateProductStock(Integer id, int stockAmount, String accessToken, String refreshToken);

    // Category operations
    Category addCategory(Category category, String accessToken, String refreshToken);

    Category getCategoryById(Integer id, String accessToken, String refreshToken);

    Category updateCategory(Integer id, Category category, String accessToken, String refreshToken);

    void deleteCategory(Integer id, String accessToken, String refreshToken);

    List<Category> getAllCategories(String accessToken, String refreshToken);
}
