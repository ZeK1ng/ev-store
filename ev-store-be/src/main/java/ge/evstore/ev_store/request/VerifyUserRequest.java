package ge.evstore.ev_store.request;

import lombok.Data;

@Data
public class VerifyUserRequest {
    private String email;
    private String verificationCode;
}
