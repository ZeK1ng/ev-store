package ge.evstore.ev_store.exception;

public class VerificationCodeExpiredException extends RuntimeException {
    public VerificationCodeExpiredException(String s) {
        super(s);
    }
}
