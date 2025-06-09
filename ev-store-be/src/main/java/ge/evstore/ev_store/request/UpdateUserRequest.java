package ge.evstore.ev_store.request;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String city;

    private String address;
    private String mobile;
}

