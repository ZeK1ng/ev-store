package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.response.GeneralExceptionResponse;
import ge.evstore.ev_store.response.MaxPriceResponse;
import ge.evstore.ev_store.response.ProductResponse;
import ge.evstore.ev_store.service.interf.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(summary = "Get the maximum price of all products", description = "Returns the maximum price of all available products.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the maximum price.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = MaxPriceResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal Server Error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @GetMapping("/max-price")
    public ResponseEntity<MaxPriceResponse> getMaxPrice() {
        return ResponseEntity.ok(
                productService.getOverAllMaxPrice()
        );
    }

    @Operation(summary = "Find a product by ID", description = "Retrieves the details of a specific product by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the product details.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ProductResponse.class))),
            @ApiResponse(responseCode = "404", description = "Product not found (e.g., EntityNotFoundException).",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal Server Error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable final Long id) {
        return ResponseEntity.ok(productService.getProductResponseById(id));
    }

    @Operation(summary = "Retrieve multiple products by their IDs", description = "Fetches details of multiple products by their IDs in bulk.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved details for all requested products.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ProductResponse[].class))),
            @ApiResponse(responseCode = "400", description = "Bad Request: Invalid list of product IDs.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal Server Error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @PostMapping("/bulk")
    public ResponseEntity<List<ProductResponse>> getProductsBulk(@RequestBody final List<Long> productIds) {
        final List<ProductResponse> products = productService.getProductsByIds(productIds);
        return ResponseEntity.ok(products);
    }

    @Operation(summary = "Get paginated and filtered list of products", description = "Returns a paginated list of products with optional filtering parameters.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of products.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "400", description = "Bad Request: Invalid query parameters.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal Server Error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(required = false, defaultValue = "0") final int page,
            @RequestParam(required = false, defaultValue = "10") final int size,
            @RequestParam(required = false, defaultValue = "id") final String sortBy,
            @RequestParam(required = false, defaultValue = "asc") final String direction,
            @RequestParam(required = false) final Long productId,
            @RequestParam(required = false) final String name,
            @RequestParam(required = false) final String categoryId, // "n1,n2,n3"
            @RequestParam(required = false) final Double minPrice,
            @RequestParam(required = false) final Double maxPrice,
            @RequestParam(required = false) final Boolean inStock,
            @RequestParam(required = false) final Boolean isPopular
    ) {
        final Page<ProductResponse> products = productService.getAllProducts(page, size, sortBy, direction, name, categoryId, minPrice, maxPrice, inStock, isPopular, productId);
        return ResponseEntity.ok(products);
    }
}