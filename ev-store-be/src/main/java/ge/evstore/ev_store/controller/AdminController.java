package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.entity.Dictionary;
import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.service.interf.AdminService;
import ge.evstore.ev_store.service.interf.DictionaryService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

import static ge.evstore.ev_store.utils.HeaderUtils.extractBearer;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminService adminService;
    private final DictionaryService dictionaryService;


    public AdminController(final AdminService adminService, final DictionaryService dictionaryService) {
        this.adminService = adminService;
        this.dictionaryService = dictionaryService;
    }

    private String extractRefreshToken(final HttpServletRequest request) {
        return request.getHeader("Refresh-Token");
    }

    // ----- PRODUCT ENDPOINTS -----

    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(
            @RequestBody final Product product,
            final HttpServletRequest request) throws AccessDeniedException {
        final String accessToken = extractBearer(request);
        return ResponseEntity.ok(
                adminService.addProduct(product, accessToken)
        );
    }

    @GetMapping("/products")
    public ResponseEntity<List<Product>> listProducts(final HttpServletRequest request) {
        final String accessToken = extractBearer(request);
        return ResponseEntity.ok(
                adminService.getAllProducts(accessToken)
        );
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProduct(
            @PathVariable final Long id,
            final HttpServletRequest request) {
        final String accessToken = extractBearer(request);
        return ResponseEntity.ok(
                adminService.getProductById(id, accessToken)
        );
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable final Long id,
            @RequestBody final Product product,
            final HttpServletRequest request) {
        final String accessToken = extractBearer(request);
        return ResponseEntity.ok(
                adminService.updateProduct(id, product, accessToken)
        );
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable final Long id,
            final HttpServletRequest request) {
        final String accessToken = extractBearer(request);
        adminService.deleteProduct(id, accessToken);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/products/{id}/stock")
    public ResponseEntity<Product> updateStock(
            @PathVariable final Long id,
            @RequestParam final int stockAmount,
            final HttpServletRequest request) {
        final String accessToken = extractBearer(request);
        return ResponseEntity.ok(
                adminService.updateProductStock(id, stockAmount, accessToken)
        );
    }

    // ----- CATEGORY ENDPOINTS -----

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(
            @RequestBody final Category category,
            final HttpServletRequest request) {
        final String accessToken = extractBearer(request);
        return ResponseEntity.ok(
                adminService.addCategory(category, accessToken)
        );
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable final Long id,
            @RequestBody final Category category,
            final HttpServletRequest request) {
        final String accessToken = extractBearer(request);
        return ResponseEntity.ok(
                adminService.updateCategory(id, category, accessToken)
        );
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable final Long id,
            final HttpServletRequest request) {
        final String accessToken = extractBearer(request);
        adminService.deleteCategory(id, accessToken);
        return ResponseEntity.ok().build();
    }

    /*-------------Dictionary endpoints-------*/
    @PostMapping("/dictionary/create")
    public ResponseEntity<Dictionary> create(@RequestBody final Dictionary dictionary) {
        return ResponseEntity.ok(dictionaryService.create(dictionary));
    }

    @PutMapping("/dictionary/update/{id}")
    public ResponseEntity<Dictionary> update(@PathVariable final Long id, @RequestBody final Dictionary dictionary) {
        final Dictionary updated = dictionaryService.update(id, dictionary);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/dictionary/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable final Long id) {
        dictionaryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dictionary/get-all")
    public ResponseEntity<List<Dictionary>> getAll() {
        return ResponseEntity.ok(dictionaryService.findAll());
    }
}

