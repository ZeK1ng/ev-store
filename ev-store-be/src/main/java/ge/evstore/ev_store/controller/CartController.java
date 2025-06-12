package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.response.CartResponse;
import ge.evstore.ev_store.response.GeneralExceptionResponse;
import ge.evstore.ev_store.service.interf.CartService;
import ge.evstore.ev_store.utils.HeaderUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @Operation(summary = "Get the cart for an authenticated user", description = "Retrieve the cart details associated with the currently authenticated user by their token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the user's cart.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CartResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized: Invalid or missing authentication token.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "404", description = "Cart not found (e.g., EntityNotFoundException).",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal Server Error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @GetMapping("/cart-for-user")
    public ResponseEntity<CartResponse> getUserCart(final HttpServletRequest req) {
        final String token = HeaderUtils.extractBearer(req);
        final CartResponse cart = cartService.getCartForUser(token);
        return ResponseEntity.ok(cart);
    }

    @Operation(summary = "Add a product to the cart", description = "Add a product to the current user's cart. Quantity is optional and defaults to 1.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully added the product to the cart and returned the updated cart.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CartResponse.class))),
            @ApiResponse(responseCode = "400", description = "Bad Request: Invalid product ID or quantity.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized: Invalid or missing authentication token.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "404", description = "Product not found (e.g., EntityNotFoundException).",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal Server Error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @PostMapping("/add")
    public ResponseEntity<CartResponse> addProductToCart(
            final HttpServletRequest req,
            @RequestParam final Long productId,
            @RequestParam(required = false) final Integer quantity) {
        final String token = HeaderUtils.extractBearer(req);
        final CartResponse cartResponse = cartService.addProductToCart(productId, quantity, token);
        return ResponseEntity.ok(cartResponse);
    }

    @Operation(summary = "Delete a product from the cart", description = "Remove a product from the current user's cart by its product ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully removed the product from the cart."),
            @ApiResponse(responseCode = "400", description = "Bad Request: Invalid product ID.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized: Invalid or missing authentication token.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "404", description = "Product or cart not found.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal Server Error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteProductFromCart(final HttpServletRequest req, @RequestParam final Long productId) {
        final String token = HeaderUtils.extractBearer(req);
        cartService.deleteProductFromCart(productId, token);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Update a product's quantity in the cart", description = "Update the quantity of a specific product in the current user's cart.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully updated the product quantity and returned the updated cart.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CartResponse.class))),
            @ApiResponse(responseCode = "400", description = "Bad Request: Invalid product ID or quantity.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized: Invalid or missing authentication token.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "404", description = "Product or cart not found.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal Server Error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @PutMapping("/update")
    public ResponseEntity<CartResponse> updateCart(final HttpServletRequest request, @RequestParam final Long productId, @RequestParam final Integer quantity) {
        final String token = HeaderUtils.extractBearer(request);
        return ResponseEntity.ok(cartService.updateProductQuantityInCart(productId, quantity, token));
    }
}