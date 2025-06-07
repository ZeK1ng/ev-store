package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.request.UpdateUserRequest;
import ge.evstore.ev_store.response.OrderHistoryResponse;
import ge.evstore.ev_store.response.UserResponse;
import ge.evstore.ev_store.service.interf.UserService;
import ge.evstore.ev_store.utils.HeaderUtils;
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

    @GetMapping("/details")
    public ResponseEntity<UserResponse> getUser(final HttpServletRequest request) {
        final String token = HeaderUtils.extractBearer(request);
        return ResponseEntity.ok(userService.getUserDetails(token));
    }

    @PatchMapping("/update")
    public ResponseEntity<UserResponse> updateUser(@RequestBody final UpdateUserRequest userDetails, final HttpServletRequest request) {
        final String token = HeaderUtils.extractBearer(request);
        return ResponseEntity.ok(userService.updateUser(token, userDetails.getCity(), userDetails.getAddress(), userDetails.getMobile()));
    }

    @GetMapping("/order-history")
    public ResponseEntity<List<OrderHistoryResponse>> getUserOrderHistory(final HttpServletRequest request) {
        final String token = HeaderUtils.extractBearer(request);
        return ResponseEntity.ok(userService.getUserOrderHistory(token));
    }
}
