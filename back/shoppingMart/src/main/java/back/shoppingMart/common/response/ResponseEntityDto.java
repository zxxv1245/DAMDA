package back.shoppingMart.common.response;


import back.shoppingMart.common.exception.ErrorResponse;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseEntityDto<T> {
    private T data;
    private String msg;
    private ErrorResponse error;

    @Builder
    public ResponseEntityDto(T data, String msg, ErrorResponse error) {
        this.data = data;
        this.msg = msg;
        this.error = error;
    }
}

