package ge.evstore.ev_store.exceptionHandler;


import ge.evstore.ev_store.exception.UserAlreadyRegisteredException;
import ge.evstore.ev_store.response.GeneralExceptionResponse;
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

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<GeneralExceptionResponse> handleAuthenticationException(AuthenticationException ex) {
        log.info(ex.getMessage());
        GeneralExceptionResponse generalExceptionResponse = new GeneralExceptionResponse(ex.getMessage(), HttpStatus.UNAUTHORIZED.value());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).
                contentType(MediaType.APPLICATION_JSON).
                body(generalExceptionResponse);

    }
}
