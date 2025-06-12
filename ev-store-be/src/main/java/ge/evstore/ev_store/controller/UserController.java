package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.request.UpdateUserRequest;
import ge.evstore.ev_store.response.GeneralExceptionResponse;
import ge.evstore.ev_store.response.OrderHistoryResponse;
import ge.evstore.ev_store.response.UserResponse;
import ge.evstore.ev_store.service.interf.UserService;
import ge.evstore.ev_store.utils.HeaderUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;

    public UserController(final UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Get user details", description = "Fetch details of the currently authenticated user by parsing the JWT token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user details",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized access. Token is missing or invalid.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "403", description = "Access is forbidden.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @GetMapping("/details")
    public ResponseEntity<UserResponse> getUser(final HttpServletRequest request) {
        final String token = HeaderUtils.extractBearer(request);
        return ResponseEntity.ok(userService.getUserDetails(token));
    }


    @Operation(summary = "Update user details", description = "Update the details of the currently authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully updated user details",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserResponse.class))),
            @ApiResponse(responseCode = "400", description = "Bad request. Validation failed for provided user details.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized access. Token is missing or invalid.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "403", description = "Access is forbidden.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @PatchMapping("/update")
    public ResponseEntity<UserResponse> updateUser(@RequestBody final UpdateUserRequest userDetails, final HttpServletRequest request) {
        final String token = HeaderUtils.extractBearer(request);
        return ResponseEntity.ok(userService.updateUser(userDetails, token));
    }

    @Operation(summary = "Get user order history", description = "Retrieve the order history of the currently authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved order history",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = OrderHistoryResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized access. Token is missing or invalid.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "403", description = "Access is forbidden.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @GetMapping("/order-history")
    public ResponseEntity<List<OrderHistoryResponse>> getUserOrderHistory(final HttpServletRequest request) {
        final String token = HeaderUtils.extractBearer(request);
        return ResponseEntity.ok(userService.getUserOrderHistory(token));
    }
}
