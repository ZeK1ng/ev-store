package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.response.MaxPriceResponse;
import ge.evstore.ev_store.response.ProductResponse;
import ge.evstore.ev_store.service.interf.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/max-price")
    public ResponseEntity<MaxPriceResponse> getMaxPrice() {
        return ResponseEntity.ok(
                productService.getOverAllMaxPrice()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable final Long id) {
        return ResponseEntity.ok(productService.getProductResponseById(id));
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<ProductResponse>> getProductsBulk(@RequestBody final List<Long> productIds) {
        final List<ProductResponse> products = productService.getProductsByIds(productIds);
        return ResponseEntity.ok(products);
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(required = false, defaultValue = "0") final int page,
            @RequestParam(required = false, defaultValue = "10") final int size,
            @RequestParam(required = false, defaultValue = "price") final String sortBy,
            @RequestParam(required = false, defaultValue = "asc") final String direction,
            @RequestParam(required = false) final Long productId,
            @RequestParam(required = false) final String name,
            @RequestParam(required = false) final String categoryId, // "n1,n2,n3"
            @RequestParam(required = false) final Double minPrice,
            @RequestParam(required = false) final Double maxPrice,
            @RequestParam(required = false) final Boolean inStock,
            @RequestParam(required = false) final Boolean isPopular,
            @RequestParam(required = false) final String itemCode,
            @RequestParam(required = false) final Boolean comingSoon
    ) {
        final Page<ProductResponse> products = productService.getAllProducts(page, size, sortBy,
                direction, name, categoryId, minPrice,
                maxPrice, inStock, isPopular, productId, itemCode, comingSoon);
        return ResponseEntity.ok(products);
    }
}
