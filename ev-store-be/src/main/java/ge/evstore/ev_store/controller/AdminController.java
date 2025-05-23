package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.service.interf.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(final AdminService adminService) {
        this.adminService = adminService;
    }


    private String extractAccessToken(final HttpServletRequest request) {
        final String header = request.getHeader("Authorization");
        return (header != null && header.startsWith("Bearer ")) ? header.substring(7) : null;
    }

    private String extractRefreshToken(final HttpServletRequest request) {
        return request.getHeader("Refresh-Token");
    }

    // ----- PRODUCT ENDPOINTS -----

    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(
            @RequestBody final Product product,
            final HttpServletRequest request) throws AccessDeniedException {
        final String accessToken = extractAccessToken(request);
        final String refreshToken = extractRefreshToken(request);
        return ResponseEntity.ok(
                adminService.addProduct(product, accessToken, refreshToken)
        );
    }

    @GetMapping("/products")
    public ResponseEntity<List<Product>> listProducts(final HttpServletRequest request) {
        final String accessToken = extractAccessToken(request);
        final String refreshToken = extractRefreshToken(request);
        return ResponseEntity.ok(
                adminService.getAllProducts(accessToken, refreshToken)
        );
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProduct(
            @PathVariable final Integer id,
            final HttpServletRequest request) {
        final String accessToken = extractAccessToken(request);
        final String refreshToken = extractRefreshToken(request);
        return ResponseEntity.ok(
                adminService.getProductById(id, accessToken, refreshToken)
        );
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable final Integer id,
            @RequestBody final Product product,
            final HttpServletRequest request) {
        final String accessToken = extractAccessToken(request);
        final String refreshToken = extractRefreshToken(request);
        return ResponseEntity.ok(
                adminService.updateProduct(id, product, accessToken, refreshToken)
        );
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable final Integer id,
            final HttpServletRequest request) {
        final String accessToken = extractAccessToken(request);
        final String refreshToken = extractRefreshToken(request);
        adminService.deleteProduct(id, accessToken, refreshToken);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/products/{id}/stock")
    public ResponseEntity<Product> updateStock(
            @PathVariable final Integer id,
            @RequestParam final int quantity,
            final HttpServletRequest request) {
        final String accessToken = extractAccessToken(request);
        final String refreshToken = extractRefreshToken(request);
        return ResponseEntity.ok(
                adminService.updateProductStock(id, quantity, accessToken, refreshToken)
        );
    }

    // ----- CATEGORY ENDPOINTS -----

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(
            @RequestBody final Category category,
            final HttpServletRequest request) {
        final String accessToken = extractAccessToken(request);
        final String refreshToken = extractRefreshToken(request);
        return ResponseEntity.ok(
                adminService.addCategory(category, accessToken, refreshToken)
        );
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> listCategories(final HttpServletRequest request) {
        final String accessToken = extractAccessToken(request);
        final String refreshToken = extractRefreshToken(request);
        return ResponseEntity.ok(
                adminService.getAllCategories(accessToken, refreshToken)
        );
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<Category> getCategory(
            @PathVariable final Integer id,
            final HttpServletRequest request) {
        final String accessToken = extractAccessToken(request);
        final String refreshToken = extractRefreshToken(request);
        return ResponseEntity.ok(
                adminService.getCategoryById(id, accessToken, refreshToken)
        );
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable final Integer id,
            @RequestBody final Category category,
            final HttpServletRequest request) {
        final String accessToken = extractAccessToken(request);
        final String refreshToken = extractRefreshToken(request);
        return ResponseEntity.ok(
                adminService.updateCategory(id, category, accessToken, refreshToken)
        );
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable final Integer id,
            final HttpServletRequest request) {
        final String accessToken = extractAccessToken(request);
        final String refreshToken = extractRefreshToken(request);
        adminService.deleteCategory(id, accessToken, refreshToken);
        return ResponseEntity.noContent().build();
    }
}

