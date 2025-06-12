package ge.evstore.ev_store.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VerifyUserRequest {
    private String email;
    private String verificationCode;
}
