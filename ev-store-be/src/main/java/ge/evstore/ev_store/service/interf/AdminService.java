package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.entity.OrderStatus;
import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.request.ProductRequest;
import ge.evstore.ev_store.response.ImageSaveResponse;
import ge.evstore.ev_store.response.OrderHistoryResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.List;

public interface AdminService {

    // Product operations
    Product addProduct(ProductRequest product, String accessToken) throws AccessDeniedException;

    Product getProductById(Long id, String accessToken);

    Product updateProduct(Long id, ProductRequest product, String accessToken);

    void deleteProduct(Long id, String accessToken);

    Product updateProductStock(Long id, int stockAmount, String accessToken);

    // Category operations
    Category addCategory(String name, String description, Long parentCategoryId ,String accessToken);

    Category updateCategory(Long id, String name, String description, String accessToken);

    void deleteCategory(Long id, String accessToken);

    List<ImageSaveResponse> saveImages(MultipartFile[] images, String accessToken) throws IOException;

    OrderHistoryResponse updateOrderStatus(OrderStatus orderStatus, Long orderId, String accessToken);
}
