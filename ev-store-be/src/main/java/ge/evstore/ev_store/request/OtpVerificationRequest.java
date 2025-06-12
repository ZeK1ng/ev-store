package ge.evstore.ev_store.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OtpVerificationRequest {
    private String email;
    private String otp;
}
