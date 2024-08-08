package back.shoppingMart.common.auth.controller;

import back.shoppingMart.common.auth.AuthTokens;
import back.shoppingMart.common.auth.kakao.KakaoLoginParams;
import back.shoppingMart.common.auth.service.OAuthLoginService;
import back.shoppingMart.common.response.MsgType;
import back.shoppingMart.common.response.ResponseEntityDto;
import back.shoppingMart.common.response.ResponseUtils;
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
    public ResponseEntityDto<AuthTokens> loginKakao(@RequestBody KakaoLoginParams params) {
        AuthTokens authTokens = oAuthLoginService.login(params);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.AUTHORIZATION, "Bearer " + authTokens.getAccessToken());

        return ResponseUtils.okWithHeaders(authTokens, MsgType.LOGIN_SUCCESSFULLY, headers);
    }
}