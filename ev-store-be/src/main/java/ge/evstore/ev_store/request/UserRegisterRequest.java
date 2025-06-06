package ge.evstore.ev_store.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UserRegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private String address;
    private String city;
    private String password;

    @Override
    public String toString() {
        return "UserRegisterRequest{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", mobile='" + mobile + '\'' +
                ", address='" + address + '\'' +
                ", city='" + city + '\'' +
                '}';
    }

}
