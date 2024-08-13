package back.shoppingMart.common.auth;


import back.shoppingMart.common.jwt.JwtTokenProvider;
import back.shoppingMart.common.redis.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class AuthTokensGenerator {
    private static final String BEARER_TYPE = "Bearer";
    private static final long ACCESS_TOKEN_EXPIRE_TIME = 1000 * 60;            // 1분
    private static final long REFRESH_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 7;  // 7일

    private static final String TOKEN_PREFIX = "Refresh-Token";

    private final JwtTokenProvider jwtTokenProvider;
    private final RedisService redisService;


    public AuthTokens generate(String email) {
        long now = (new Date()).getTime();
        Date accessTokenExpiredAt = new Date(now + ACCESS_TOKEN_EXPIRE_TIME);
        Date refreshTokenExpiredAt = new Date(now + REFRESH_TOKEN_EXPIRE_TIME);

        String accessToken = jwtTokenProvider.generate(email, accessTokenExpiredAt);
        String refreshToken = jwtTokenProvider.generate(email, refreshTokenExpiredAt);

        // Refresh token의 생존 기간을 Duration 객체로 변환
        Duration refreshTokenDuration = Duration.ofMillis(REFRESH_TOKEN_EXPIRE_TIME);

        redisService.setValues(TOKEN_PREFIX + email, refreshToken, refreshTokenDuration);

        return AuthTokens.of(accessToken, refreshToken, BEARER_TYPE, ACCESS_TOKEN_EXPIRE_TIME / 1000L);
    }

    public Long extractMemberId(String accessToken) {
        return Long.valueOf(jwtTokenProvider.extractSubject(accessToken));
    }
}