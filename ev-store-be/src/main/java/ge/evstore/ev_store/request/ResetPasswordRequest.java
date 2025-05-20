package ge.evstore.ev_store.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String username;
    private String verificationCode;
    private String newPassword;
}
