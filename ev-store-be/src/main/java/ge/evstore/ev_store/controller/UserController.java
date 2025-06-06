package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.response.OrderHistoryResponse;
import ge.evstore.ev_store.response.UserResponse;
import ge.evstore.ev_store.service.interf.UserService;
import ge.evstore.ev_store.utils.HeaderUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<UserResponse> updateUser(@RequestParam final String city, @RequestParam final String address, @RequestParam final String phone, final HttpServletRequest request) {
        final String token = HeaderUtils.extractBearer(request);
        return ResponseEntity.ok(userService.updateUser(token, city, address, phone));
    }

    @GetMapping
    public ResponseEntity<OrderHistoryResponse> getUserOrderHistory(final HttpServletRequest request){
        final String token = HeaderUtils.extractBearer(request);
        return ResponseEntity.ok(userService.getUserOrderHistory(token));
    }
}
