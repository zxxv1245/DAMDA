package back.shoppingMart.common.response;


import back.shoppingMart.common.exception.ErrorResponse;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpHeaders;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseEntityDto<T> {
    private T data;
    private String msg;
    private ErrorResponse error;
    private HttpHeaders headers;

    @Builder
    public ResponseEntityDto(T data, String msg, ErrorResponse error, HttpHeaders headers) {
        this.data = data;
        this.msg = msg;
        this.error = error;
        this.headers = headers;
    }
}

