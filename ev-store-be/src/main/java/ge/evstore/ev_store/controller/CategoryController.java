package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.response.CategoryFullTreeResponse;
import ge.evstore.ev_store.response.CategoryWithoutChildren;
import ge.evstore.ev_store.service.interf.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/get-full-path/{id}")
    public ResponseEntity<List<CategoryWithoutChildren>> getFullCategoryPath(
            @PathVariable final Long id) {
        return ResponseEntity.ok(categoryService.getFullCategoryPath(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<CategoryFullTreeResponse>> listCategories() {
        return ResponseEntity.ok(
                categoryService.getAllCategories()
        );
    }

    @GetMapping("/list-all")
    public ResponseEntity<List<CategoryWithoutChildren>> listAllCategories() {
        return ResponseEntity.ok(categoryService.flatListAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategory(
            @PathVariable final Long id) {
        return ResponseEntity.ok(
                categoryService.getCategoryById(id)
        );
    }

}
