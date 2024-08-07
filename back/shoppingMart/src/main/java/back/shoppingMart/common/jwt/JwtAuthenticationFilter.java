package back.shoppingMart.common.jwt;

import back.shoppingMart.user.dto.LoginRequestDto;
import back.shoppingMart.common.auth.PrincipalDetails;

import com.auth0.jwt.algorithms.Algorithm;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


import com.auth0.jwt.JWT;
import java.io.IOException;
import java.util.Date;


@RequiredArgsConstructor
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    // /login 요청을 하면 로그인 시도를 하기 위해서 실행
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        System.out.println("JWTAuthenticationFilter : 로그인 시도 중");
        // username, password 받아서
        ObjectMapper om = new ObjectMapper();
        LoginRequestDto loginRequestDto = null;
        try {
            // json 데이터 파싱
            loginRequestDto = om.readValue(request.getInputStream(), LoginRequestDto.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
            // 토큰 만들기
        UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword());

            // PrincipalDetailsService의 loadUserByUsername() 함수가 실행됨
        Authentication authentication = authenticationManager.authenticate(authenticationToken);

            // 다운 캐스팅, authentication 객체가 session 영역에 저장됨 => 로그인이 되었다는 뜻
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        System.out.println("로그인 완료 : " + principalDetails.getUser().getEmail());

        return authentication;

        // 정상인지 로그인 시도를 해보는 것
        // authenticationManager로 로그인 시도를 하면
        // PrincipalDetailsService가 호출 loadUserByUsername() 함수가 실행
        // PrincipalDetails를 세션에 담고(권한 관리를 위해서) JWT 토큰을 만들고 응답해주면 됨

    }

    // 커스텀 로그인 설정
    public JwtAuthenticationFilter(AuthenticationManager authenticationManager,JwtTokenProvider jwtTokenProvider, String loginUrl){
        this.authenticationManager =authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        setFilterProcessesUrl(loginUrl);
    }

    // attemptAuthentication 실행 => 인증이 정상적으로 되었다면 successfulAuthentication 실행
    // JWT 토큰을 만들어서 request 요청을 한 사용자에게 JWT 토큰을 response 해주면 됨
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        System.out.println("successfulAuthentication 실행됨 : 인증 완료");

        PrincipalDetails principalDetails = (PrincipalDetails) authResult.getPrincipal();

        String jwtToken = jwtTokenProvider.generate(principalDetails.getUser().getEmail(), new Date(System.currentTimeMillis() + JwtProperties.EXPIRATION_TIME));
//        String jwtToken = JWT.create()
//                .withSubject("로그인 토큰") // 토큰 이름
//                .withExpiresAt(new Date(System.currentTimeMillis()+JwtProperties.EXPIRATION_TIME)) // 토큰 만료 시간 => 현재 시간 + 10분
//                .withClaim("id", principalDetails.getUser().getId())  // 비공개 claim, 내가 넣고 싶은 value값
//                .withClaim("email", principalDetails.getUser().getEmail())
//                .sign(Algorithm.HMAC512(JwtProperties.SECRET));  // 내 서버가 아는 고유의 값

        // 사용자한테 응답할 response 헤더에
        response.addHeader(JwtProperties.HEADER_STRING, JwtProperties.TOKEN_PREFIX+jwtToken);
    }
}
