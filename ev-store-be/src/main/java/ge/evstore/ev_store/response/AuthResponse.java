package ge.evstore.ev_store.response;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class AuthResponse {
    public String accessToken;
    public String refreshToken;
}
