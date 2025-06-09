package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.entity.Dictionary;
import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.request.CreateCategoryRequest;
import ge.evstore.ev_store.request.ProductRequest;
import ge.evstore.ev_store.response.ImageSaveResponse;
import ge.evstore.ev_store.service.interf.AdminService;
import ge.evstore.ev_store.service.interf.DictionaryService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    // ----- PRODUCT ENDPOINTS -----

    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(
            @RequestBody final ProductRequest productRequest,
            final HttpServletRequest request) throws AccessDeniedException {
        final String accessToken = extractBearer(request);
        return ResponseEntity.ok(
                adminService.addProduct(productRequest, accessToken)
        );
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable final Long id,
            @RequestBody final ProductRequest productRequest,
            final HttpServletRequest request) {
        final String accessToken = extractBearer(request);
        return ResponseEntity.ok(
                adminService.updateProduct(id, productRequest, accessToken)
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
            @RequestBody final CreateCategoryRequest categoryRequest,
            final HttpServletRequest request) {
        final String accessToken = extractBearer(request);
        return ResponseEntity.ok(
                adminService.addCategory(categoryRequest.getName(), categoryRequest.getDescription(), categoryRequest.getParentCategoryId(), accessToken)
        );
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable final Long id,
            @RequestBody final CreateCategoryRequest categoryRequest,
            final HttpServletRequest request) {
        final String accessToken = extractBearer(request);
        return ResponseEntity.ok(
                adminService.updateCategory(id, categoryRequest.getName(), categoryRequest.getDescription(), accessToken)
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

    @PostMapping(value = "/image/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<ImageSaveResponse>> uploadImage(final HttpServletRequest request, @RequestParam("image") final MultipartFile[] images) throws IOException {
        final String accessToken = extractBearer(request);
        final List<ImageSaveResponse> responses = adminService.saveImages(images, accessToken);
        return ResponseEntity.ok(responses);
    }
}

