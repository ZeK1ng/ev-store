package ge.evstore.ev_store.exception;


public class VerificationCodeExpiredException extends RuntimeException {
    public VerificationCodeExpiredException(final String s) {
        super(s);
    }
}
