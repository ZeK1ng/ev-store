package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.exception.UserAlreadyRegisteredException;
import ge.evstore.ev_store.request.UserRegisterRequest;
import ge.evstore.ev_store.response.CartResponse;
import ge.evstore.ev_store.response.OrderHistoryResponse;
import ge.evstore.ev_store.response.UserResponse;

import java.util.Optional;

public interface UserService {

    Optional<User> findUser(String username);

    User registerUserWithoutVerification(UserRegisterRequest request, String verificationCode) throws UserAlreadyRegisteredException;

    User verifyUser(User userFound);

    void updateVerificationCodeFor(User user, String verificationCode);

    void updatePassword(User user, String newPassword);

    UserResponse getUserDetails(final String accessToken);

    UserResponse updateUser(String token, String city, String address, String phone);

    void saveOrderHistory(User user, CartResponse cartForUser);

    OrderHistoryResponse getUserOrderHistory(String token);
}
