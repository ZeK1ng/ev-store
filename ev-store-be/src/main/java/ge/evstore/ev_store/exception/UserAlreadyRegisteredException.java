package ge.evstore.ev_store.exception;

import ge.evstore.ev_store.request.UserRegisterRequest;

public class UserAlreadyRegisteredException extends RuntimeException {

    public UserAlreadyRegisteredException(UserRegisterRequest userRegisterRequest) {
        super(constructMessage(userRegisterRequest));

    }

    private static String constructMessage(UserRegisterRequest userRegisterRequest) {
        return "User already registered with this email address: " +
                userRegisterRequest.getEmail() +
                "name and surname: " +
                userRegisterRequest.getFirstName() + " " + userRegisterRequest.getLastName() +
                "\n";
    }
}
