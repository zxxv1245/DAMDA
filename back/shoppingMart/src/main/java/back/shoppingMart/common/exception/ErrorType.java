package back.shoppingMart.common.exception;


import lombok.Getter;

@Getter
public enum ErrorType {

    //-----------------------------------------------------
    USER_NOT_FOUND(400, "유저를 찾지 못했습니다."),
    CONTENT_IS_NULL(400, "입력되지 않은 정보가 있습니다."),
    DUPLICATED_EMAIL(400, "중복된 이메일입니다."),
    NO_EMAIL_INPUT(400, "이메일을 입력하지 않았습니다."),
    NO_PSW_INPUT(400, "비밀번호를 입력하지 않았습니다."),
    NO_USERNAME_INPUT(400, "닉네임을 입력하지 않았습니다."),
    NO_BIRTHDATE_INPUT(400, "생년월일을 입력하지 않았습니다."),
    NOT_FOUND_USER(401, "등록된 사용자가 없습니다."),
    EMAIL_NOT_FOUND(401,"등록된 이메일이 없습니다." ),
    NOT_MATCHING_INFO(401, "아이디 또는 비밀번호를 잘못 입력했습니다."),
    NO_TOKEN(401, "토큰이 없습니다."),
    NOT_VALID_TOKEN(401, "토큰이 유효하지 않습니다."),
    PSW_DIFFERENT(401, "현재 비밀번호가 다릅니다."),
    UNABLE_TO_SEND_EMAIL(500, "이메일 전송을 실패했습니다."),
    NOT_FOUND_PRODUCT(400,"없는 상품입니다."),
    TOKEN_EXPIRED(400,"유효하지 않은 토큰입니다."),
    FILE_CONVERT_FAIL(415,"변환 실패하였습니다."),
    NO_SUCH_ALGORITHM(500, "알 수 없는 알고리즘입니다.");

    //---------------------------------------------------------------------

    private int code;
    private String msg;

    ErrorType(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

}