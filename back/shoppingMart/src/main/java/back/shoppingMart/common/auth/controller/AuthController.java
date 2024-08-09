package back.shoppingMart.common.auth.controller;

import back.shoppingMart.common.auth.AuthTokens;
import back.shoppingMart.common.auth.kakao.KakaoLoginParams;
import back.shoppingMart.common.auth.naver.NaverLoginParams;
import back.shoppingMart.common.auth.service.OAuthLoginService;
import back.shoppingMart.common.response.MsgType;
import back.shoppingMart.common.response.ResponseEntityDto;
import back.shoppingMart.common.response.ResponseUtils;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final OAuthLoginService oAuthLoginService;

    @PostMapping("/kakao")
    public ResponseEntityDto<AuthTokens> loginKakao(@RequestBody KakaoLoginParams params, HttpServletResponse response) {
        AuthTokens authTokens = oAuthLoginService.login(params);
        response.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + authTokens.getAccessToken());
        response.addHeader("Refresh-Token", "Bearer " + authTokens.getRefreshToken());
        return ResponseUtils.ok(authTokens, MsgType.LOGIN_SUCCESSFULLY);
    }
    @PostMapping("/naver")
    public ResponseEntityDto<AuthTokens> loginNaver(@RequestBody NaverLoginParams params, HttpServletResponse response) {
        AuthTokens authTokens = oAuthLoginService.login(params);
        response.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + authTokens.getAccessToken());
        response.addHeader("Refresh-Token", "Bearer " + authTokens.getRefreshToken());
        return ResponseUtils.ok(authTokens, MsgType.LOGIN_SUCCESSFULLY);
    }

}