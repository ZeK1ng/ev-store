package ge.evstore.ev_store.response;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GeneralExceptionResponse {
    private String errorMessage;
    private int code;
}
