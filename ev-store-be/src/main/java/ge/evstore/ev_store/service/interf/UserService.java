package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.entity.Order;
import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.exception.UserAlreadyRegisteredException;
import ge.evstore.ev_store.request.UnauthenticatedUserReservationRequest;
import ge.evstore.ev_store.request.UpdateUserRequest;
import ge.evstore.ev_store.request.UserRegisterRequest;
import ge.evstore.ev_store.response.CartResponse;
import ge.evstore.ev_store.response.OrderHistoryResponse;
import ge.evstore.ev_store.response.UserResponse;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

public interface UserService {

    Optional<User> findUser(String username);

    User registerUserWithoutVerification(UserRegisterRequest request, String verificationCode) throws UserAlreadyRegisteredException;

    User verifyUser(User userFound);

    void updateVerificationCodeFor(User user, String verificationCode);

    void updatePassword(User user, String newPassword);

    UserResponse getUserDetails(final String accessToken);

    UserResponse updateUser(UpdateUserRequest userUpdateDetails, String token) throws UserAlreadyRegisteredException;

    Order saveOrderHistory(User user, CartResponse cartForUser, String specialInstructions);

    List<OrderHistoryResponse> getUserOrderHistory(String token);

    void saveOrderHistoryForGuest(UnauthenticatedUserReservationRequest request);
}
