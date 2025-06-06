package ge.evstore.ev_store.exception;

public class AmountExceededException extends RuntimeException {
    public AmountExceededException(final String message) {
        super(message);
    }
}
