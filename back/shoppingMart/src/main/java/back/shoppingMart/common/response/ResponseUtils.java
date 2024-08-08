package back.shoppingMart.common.response;


import back.shoppingMart.common.exception.ErrorResponse;
import org.springframework.http.HttpHeaders;

public class ResponseUtils {

    public static <T> ResponseEntityDto<T> ok(T data, MsgType msg) {
        return ResponseEntityDto.<T>builder()
                .data(data)
                .msg(msg.getMsg())
                .build();
    }

    public static ResponseEntityDto<Void> ok(MsgType msg) {
        return ResponseEntityDto.<Void>builder()
                .msg(msg.getMsg())
                .build();
    }

    public static ResponseEntityDto<Void> error(ErrorResponse error) {
        return ResponseEntityDto.<Void>builder()
                .error(error)
                .build();
    }

    public static <T> ResponseEntityDto<T> okWithHeaders(T data, MsgType msg, HttpHeaders headers) {
        return ResponseEntityDto.<T>builder()
                .data(data)
                .msg(msg.getMsg())
                .headers(headers)
                .build();
    }
}
