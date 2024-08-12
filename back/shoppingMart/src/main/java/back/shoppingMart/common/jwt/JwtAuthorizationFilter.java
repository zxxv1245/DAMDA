package back.shoppingMart.common.jwt;

import back.shoppingMart.common.auth.AuthTokens;
import back.shoppingMart.common.auth.AuthTokensGenerator;
import back.shoppingMart.common.auth.PrincipalDetails;
import back.shoppingMart.common.exception.CustomException;
import back.shoppingMart.common.exception.ErrorType;
import back.shoppingMart.common.redis.RedisService;
import back.shoppingMart.user.entity.User;
import back.shoppingMart.user.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import java.io.IOException;

public class JwtAuthorizationFilter extends BasicAuthenticationFilter {


    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisService redisService;
    private final AuthTokensGenerator authTokensGenerator;

    public JwtAuthorizationFilter(AuthenticationManager authenticationManager, UserRepository userRepository,JwtTokenProvider jwtTokenProvider, RedisService redisService, AuthTokensGenerator authTokensGenerator) {
        super(authenticationManager);
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.redisService =redisService;
        this.authTokensGenerator =authTokensGenerator;

    }

    // 인증이나 권한이 필요한 주소 요청이 있을 때 해당 필터를 타게 됨
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {

        System.out.println("인증이나 권한이 필요한 주소 요청이 됨");

        String jwtHeader = request.getHeader("Authorization");
        System.out.println("jwtHeader : " + jwtHeader);

        // JWT 토큰을 검증을 해서 정상적인 사용자인지 확인
        // 헤더가 존재하는지 확인
        if (jwtHeader == null || !jwtHeader.startsWith(JwtProperties.TOKEN_PREFIX)) {
            chain.doFilter(request, response);
            return;
        }

        // 토큰 검증으로 통해 정상적인 사용자인지 확인
        String jwtToken = jwtHeader.replace(JwtProperties.TOKEN_PREFIX, "");

        try {
            String email = jwtTokenProvider.extractSubject(jwtToken);
            validateAndAuthenticateUser(email);
            chain.doFilter(request, response);
        } catch (CustomException e) {
            if (e.getErrorType() == ErrorType.TOKEN_EXPIRED) {
                System.out.println("유효하지 않음");
                handleInvalidToken(request, response);
            } else {
                throw e;
            }
        }

    }

    private void validateAndAuthenticateUser(String email) throws IOException, ServletException {
        if (email != null) {
            User userEntity = userRepository.findByEmail(email);
            if (userEntity != null) {
                PrincipalDetails principalDetails = new PrincipalDetails(userEntity);
                Authentication authentication = new UsernamePasswordAuthenticationToken(principalDetails, null, principalDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                throw new CustomException(ErrorType.USER_NOT_FOUND);
            }
        }
    }



    private void handleInvalidToken(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        String refreshTokenHeader = request.getHeader("Refresh-Token");
        if (refreshTokenHeader != null && refreshTokenHeader.startsWith(JwtProperties.TOKEN_PREFIX)) {
            String refreshToken = refreshTokenHeader.replace(JwtProperties.TOKEN_PREFIX, "");
            System.out.println("헤더 리프레시 토큰 : "+refreshToken);
            try {
                String email = jwtTokenProvider.extractSubject(refreshToken);
                System.out.println(email);
                String storedRefreshToken = redisService.getValues("Refresh-Token" + email);
                System.out.println("Refresh-Token" + email);
                System.out.println("조회한 리프레시 토큰"+ storedRefreshToken);
                if (storedRefreshToken != null && storedRefreshToken.equals(refreshToken)) {
                    User userEntity = userRepository.findByEmail(email);
                    if (userEntity != null) {
                        AuthTokens newAuthTokens = authTokensGenerator.generate(email);
                        response.addHeader(JwtProperties.HEADER_STRING, JwtProperties.TOKEN_PREFIX + newAuthTokens.getAccessToken());
                        response.addHeader(JwtProperties.HEADER_REFRESH, JwtProperties.TOKEN_PREFIX + newAuthTokens.getRefreshToken());
                        System.out.println(newAuthTokens.getAccessToken());
                        validateAndAuthenticateUser(email);

                    } else {
                        throw new CustomException(ErrorType.USER_NOT_FOUND);
                    }
                } else {
                    System.out.println("Stored refresh token is null or does not match");
                    throw new CustomException(ErrorType.NOT_VALID_TOKEN);
                }
            } catch (Exception ex) {
                ex.printStackTrace(); // 로그에 예외 출력
                System.out.println("Exception during refresh token handling: " + ex.getMessage());
                throw new CustomException(ErrorType.NOT_VALID_TOKEN);
            }
        } else {
            System.out.println("Refresh token header is missing or invalid");
            throw new CustomException(ErrorType.NOT_VALID_TOKEN);
        }

    }
}