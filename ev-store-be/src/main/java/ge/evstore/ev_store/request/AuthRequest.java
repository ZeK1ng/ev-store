package ge.evstore.ev_store.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@AllArgsConstructor
public class AuthRequest {
    private String username;
    private String password;
}
