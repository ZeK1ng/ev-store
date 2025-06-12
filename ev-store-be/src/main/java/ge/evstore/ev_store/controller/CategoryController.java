package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.response.CategoryFullTreeResponse;
import ge.evstore.ev_store.response.CategoryWithoutChildren;
import ge.evstore.ev_store.response.GeneralExceptionResponse;
import ge.evstore.ev_store.service.interf.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(summary = "Get the full path of a category", description = "Fetches the full hierarchy path of a specific category by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the full category path.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CategoryWithoutChildren[].class))),
            @ApiResponse(responseCode = "404", description = "Category not found (e.g., EntityNotFoundException).",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal Server Error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @GetMapping("/get-full-path/{id}")
    public ResponseEntity<List<CategoryWithoutChildren>> getFullCategoryPath(
            @PathVariable final Long id) {
        return ResponseEntity.ok(categoryService.getFullCategoryPath(id));
    }

    @Operation(summary = "Get all categories as a tree", description = "Retrieves a full tree representation of all categories.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved all categories in a tree format.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CategoryFullTreeResponse[].class))),
            @ApiResponse(responseCode = "500", description = "Internal Server Error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @GetMapping("/all")
    public ResponseEntity<List<CategoryFullTreeResponse>> listCategories() {
        return ResponseEntity.ok(
                categoryService.getAllCategories()
        );
    }

    @Operation(summary = "Get all categories as a flat list", description = "Retrieves a flat list of all categories without hierarchy.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved all categories in a flat list.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CategoryWithoutChildren[].class))),
            @ApiResponse(responseCode = "500", description = "Internal Server Error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @GetMapping("/list-all")
    public ResponseEntity<List<CategoryWithoutChildren>> listAllCategories() {
        return ResponseEntity.ok(categoryService.flatListAllCategories());
    }

    @Operation(summary = "Get a category by ID", description = "Fetches details of a specific category by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the category details.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Category.class))),
            @ApiResponse(responseCode = "404", description = "Category not found (e.g., EntityNotFoundException).",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal Server Error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategory(
            @PathVariable final Long id) {
        return ResponseEntity.ok(
                categoryService.getCategoryById(id)
        );
    }
}