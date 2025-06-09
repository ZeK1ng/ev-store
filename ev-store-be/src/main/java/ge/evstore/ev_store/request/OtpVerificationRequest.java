package ge.evstore.ev_store.request;

import lombok.Data;

@Data
public class OtpVerificationRequest {
    private String email;
    private String otp;
}
