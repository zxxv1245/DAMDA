package back.shoppingMart.common.response;

import lombok.Getter;

@Getter
public enum MsgType {

    SIGNUP_SUCCESSFULLY("회원가입이 완료되었습니다."),
    LOGIN_SUCCESSFULLY("로그인이 완료되었습니다."),
    UPDATED_SUCCESSFULLY("수정 완료"),
    SEARCH_SUCCESSFULLY("조회 성공"),
    DATA_SUCCESSFULLY("데이터 생성 성공"),
    DELETED_SUCCESSFULLY("회원 탈퇴 완료"),
    PSW_CHANGED_SUCCESSFULLY("비밀번호 변경 완료"),
    GENERATE_TOKEN_SUCCESSFULLY("토큰 생성 성공"),
    DUPLICATION_TEST_COMPLETE("이메일 중복 검사 완료"),
    EMAIL_SUCCESSFULLY_SENT("이메일이 성공적으로 전송되었습니다."),
    EMAIL_SEARCHED_SUCCESSFULLY("이메일 조회가 완료되었습니다."),
    PURCHASE_SAVED("새로운 구매 저장 완료");

    private final String msg;

    MsgType(String msg){
        this.msg = msg;
    }
}
