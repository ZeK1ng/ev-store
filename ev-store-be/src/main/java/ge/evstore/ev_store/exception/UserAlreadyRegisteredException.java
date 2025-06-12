package ge.evstore.ev_store.exception;

import ge.evstore.ev_store.request.UserRegisterRequest;

public class UserAlreadyRegisteredException extends RuntimeException {

    public UserAlreadyRegisteredException(final UserRegisterRequest userRegisterRequest) {
        super(constructMessage(userRegisterRequest));

    }

    public UserAlreadyRegisteredException(final String emailAlreadyRegistered) {
        super(emailAlreadyRegistered);
    }

    private static String constructMessage(final UserRegisterRequest userRegisterRequest) {
        return "User already registered with this email address: " +
                userRegisterRequest.getEmail() +
                ". Requested name and surname: " +
                userRegisterRequest.getFirstName() + " " + userRegisterRequest.getLastName();
    }
}
