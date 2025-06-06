package ge.evstore.ev_store.response;

import ge.evstore.ev_store.entity.User;
import lombok.Data;

@Data
public class UserResponse {
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private String address;
    private String city;

    public void fromUser(final User user) {
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.mobile = user.getMobile();
        this.address = user.getAddress();
        this.city = user.getCity();
    }
}
