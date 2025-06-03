package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.service.interf.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/product")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping("/max-price")
    public ResponseEntity<Double> listCategories() {
        return ResponseEntity.ok(
                productService.getOverAllMaxPrice()
        );
    }
}
