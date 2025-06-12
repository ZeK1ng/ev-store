package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.entity.Dictionary;
import ge.evstore.ev_store.entity.OrderStatus;
import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.request.CreateCategoryRequest;
import ge.evstore.ev_store.request.ProductRequest;
import ge.evstore.ev_store.response.GeneralExceptionResponse;
import ge.evstore.ev_store.response.ImageSaveResponse;
import ge.evstore.ev_store.response.OrderHistoryResponse;
import ge.evstore.ev_store.service.interf.AdminService;
import ge.evstore.ev_store.service.interf.DictionaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
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
    @Operation(summary = "Create a new product", description = "Allows an admin to create a new product. Requires an access token provided in the request header.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully created the product.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input or bad request.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized: Invalid or missing access token.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden: Insufficient permissions or access denied.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "404", description = "Entity not found (e.g., related category or product).",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(
            @RequestBody final ProductRequest productRequest,
            final HttpServletRequest request) throws AccessDeniedException {
        final String accessToken = extractBearer(request);
        return ResponseEntity.ok(
                adminService.addProduct(productRequest, accessToken)
        );
    }

    @Operation(summary = "Update an existing product", description = "Allows an admin to update product details by its ID. Requires an access token provided in the request header.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully updated the product.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input or bad request.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized: Invalid or missing access token.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden: Insufficient permissions or access denied.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "404", description = "Product not found.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
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

    @Operation(summary = "Delete a specific product", description = "Allows an admin to delete a product by its ID. Requires an access token provided in the request header.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product deleted successfully."),
            @ApiResponse(responseCode = "401", description = "Unauthorized: Invalid or missing access token.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden: Insufficient permissions or access denied.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "404", description = "Product not found.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable final Long id,
            final HttpServletRequest request) {
        final String accessToken = extractBearer(request);
        adminService.deleteProduct(id, accessToken);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Update product stock", description = "Allows an admin to update the stock quantity of a product by its ID. Requires an access token provided in the request header.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Stock updated successfully.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class))),
            @ApiResponse(responseCode = "400", description = "Invalid stock amount or request data.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized: Missing or invalid access token.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden: Insufficient permissions or access denied.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "404", description = "Product not found.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
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
    @Operation(summary = "Create a new category", description = "Allows an admin to create a new category. Requires an access token provided in the request header.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category created successfully.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Category.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input or request payload.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized: Missing or invalid access token.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden: Insufficient permissions or access denied.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "404", description = "Parent category not found (if applicable).",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(
            @RequestBody final CreateCategoryRequest categoryRequest,
            final HttpServletRequest request) {
        final String accessToken = extractBearer(request);
        return ResponseEntity.ok(
                adminService.addCategory(categoryRequest.getName(), categoryRequest.getDescription(), categoryRequest.getParentCategoryId(), accessToken)
        );
    }

    @Operation(summary = "Update a category", description = "Allows an admin to update an existing category's details by its ID. Requires an access token for authorization.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category updated successfully.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Category.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input or malformed request payload.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized: Invalid or missing access token.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden: Insufficient permissions or access denied.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "404", description = "Category not found.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
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

    @Operation(summary = "Delete a category", description = "Allows an admin to delete a category by its ID. This action may fail if the category still has dependent products or subcategories. Requires an access token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category deleted successfully."),
            @ApiResponse(responseCode = "401", description = "Unauthorized: Invalid or missing access token.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden: Insufficient permissions or access denied.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "404", description = "Category not found.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
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

    @Operation(summary = "Upload images", description = "Allows an admin to upload one or more images. Requires an access token for authorization.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Images uploaded successfully. Returns a list of saved image information.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ImageSaveResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request or image files.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized: Invalid or missing access token.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden: Insufficient permissions or access denied.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @PostMapping(value = "/image/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<ImageSaveResponse>> uploadImage(final HttpServletRequest request, @RequestParam("image") final MultipartFile[] images) throws IOException {
        final String accessToken = extractBearer(request);
        final List<ImageSaveResponse> responses = adminService.saveImages(images, accessToken);
        return ResponseEntity.ok(responses);
    }

    /*--------------------Order History --------------*/

    @Operation(summary = "Change order status", description = "Allows an admin to change the status of a specific order by its ID. Requires an access token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order status updated successfully.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = OrderHistoryResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid order ID or status.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized: Invalid or missing access token.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden: Insufficient permissions or access denied.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "404", description = "Order not found.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @PatchMapping("/orders/change-status")
    public ResponseEntity<OrderHistoryResponse> changeStatus(
            final HttpServletRequest request, @RequestParam final Long orderId, @RequestParam final OrderStatus orderStatus) {
        final String accessToken = extractBearer(request);
        return ResponseEntity.ok(adminService.updateOrderStatus(orderStatus, orderId, accessToken));
    }

    @Operation(summary = "Get all orders", description = "Retrieves all orders with optional filters (pagination, ID, order status). Requires an access token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Orders fetched successfully.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = OrderHistoryResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid pagination request or filters.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized: Invalid or missing access token.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden: Insufficient permissions or access denied.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @GetMapping("/orders/get-all")
    public ResponseEntity<Page<OrderHistoryResponse>> getAllOrders(
            final HttpServletRequest request,
            @RequestParam(required = false, defaultValue = "0") final int page,
            @RequestParam(required = false, defaultValue = "10") final int size,
            @RequestParam(required = false) final Long id,
            @RequestParam(required = false) final OrderStatus orderStatus) {
        final String accessToken = extractBearer(request);
        return ResponseEntity.ok(adminService.getAllOrders(page, size, id, orderStatus, accessToken));
    }
}

