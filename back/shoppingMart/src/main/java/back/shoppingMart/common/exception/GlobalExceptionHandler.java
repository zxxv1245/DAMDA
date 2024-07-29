package back.shoppingMart.common.exception;


import back.shoppingMart.common.response.ResponseEntityDto;
import back.shoppingMart.common.response.ResponseUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = MethodArgumentNotValidException.class )
    public ResponseEntity<ResponseEntityDto<Void>> methodValidException(MethodArgumentNotValidException e) {
        ErrorResponse responseDto = ErrorResponse.of(e.getBindingResult());
        log.error("methodValidException throw Exception : {}", e.getBindingResult());

        return ResponseEntity.badRequest().body(ResponseUtils.error(responseDto));
    }

    @ExceptionHandler(value = CustomException.class)
    protected ResponseEntity<ResponseEntityDto<Void>> handleCustomException(CustomException e) {
        ErrorResponse responseDto = ErrorResponse.of(e.getErrorType());
        log.error("handleDataException throw Exception : {}", e.getErrorType());

        return ResponseEntity
                .status(e.getErrorType().getCode())
                .body(ResponseUtils.error(responseDto));
    }
}
