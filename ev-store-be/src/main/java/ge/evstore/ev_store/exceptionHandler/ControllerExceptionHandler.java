package ge.evstore.ev_store.exceptionHandler;


import ge.evstore.ev_store.exception.UserAlreadyRegisteredException;
import ge.evstore.ev_store.exception.VerificationCodeExpiredException;
import ge.evstore.ev_store.exception.VerificationFailedException;
import ge.evstore.ev_store.response.GeneralExceptionResponse;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class ControllerExceptionHandler {

    @ExceptionHandler(UserAlreadyRegisteredException.class)
    public ResponseEntity<GeneralExceptionResponse> handleUserAlreadyRegisteredException(UserAlreadyRegisteredException ex) {
        log.info(ex.getMessage());
        GeneralExceptionResponse generalExceptionResponse = new GeneralExceptionResponse(ex.getMessage(), HttpStatus.CONFLICT.value());
        return ResponseEntity.status(HttpStatus.CONFLICT).
                contentType(MediaType.APPLICATION_JSON).
                body(generalExceptionResponse);
    }
    @ExceptionHandler(VerificationCodeExpiredException.class)
    public ResponseEntity<GeneralExceptionResponse> handleVerificationCodeExpiredException(VerificationCodeExpiredException ex) {
        log.info(ex.getMessage());
        GeneralExceptionResponse generalExceptionResponse = new GeneralExceptionResponse(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).
                contentType(MediaType.APPLICATION_JSON).
                body(generalExceptionResponse);
    }

    @ExceptionHandler(VerificationFailedException.class)
    public ResponseEntity<GeneralExceptionResponse> handleAuthenticationException(VerificationFailedException ex) {
        log.info(ex.getMessage());
        GeneralExceptionResponse generalExceptionResponse = new GeneralExceptionResponse(ex.getMessage(), HttpStatus.FORBIDDEN.value());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).
                contentType(MediaType.APPLICATION_JSON).
                body(generalExceptionResponse);
    }
    @ExceptionHandler(MessagingException.class)
    public ResponseEntity<GeneralExceptionResponse> handleAuthenticationException(MessagingException ex) {
        log.info(ex.getMessage());
        GeneralExceptionResponse generalExceptionResponse = new GeneralExceptionResponse("Verification Mail send failed", HttpStatus.INTERNAL_SERVER_ERROR.value());
        return ResponseEntity.status(HttpStatus.INSUFFICIENT_STORAGE).
                contentType(MediaType.APPLICATION_JSON).
                body(generalExceptionResponse);
    }
}
