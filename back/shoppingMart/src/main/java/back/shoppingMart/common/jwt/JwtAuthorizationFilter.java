package back.shoppingMart.common.jwt;

import back.shoppingMart.common.auth.PrincipalDetails;
import back.shoppingMart.common.exception.CustomException;
import back.shoppingMart.common.exception.ErrorType;
import back.shoppingMart.user.entity.User;
import back.shoppingMart.user.repository.UserRepository;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
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

    public JwtAuthorizationFilter(AuthenticationManager authenticationManager, UserRepository userRepository) {
        super(authenticationManager);
        this.userRepository = userRepository;

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
        String jwtToken = request.getHeader(JwtProperties.HEADER_STRING).replace(JwtProperties.TOKEN_PREFIX,"");

        String username = JWT.require(Algorithm.HMAC512(JwtProperties.SECRET)).build().verify(jwtToken)
                .getClaim("username").asString();

        // 서명이 정상적으로 됨
        if (username != null) {
            User userEntity = userRepository.findByUsername(username);

            // JWT 토큰 서명을 통해서 서명이 정상이면 Authentication 객체를 만들어 준다
            PrincipalDetails principalDetails = new PrincipalDetails((userEntity));
            Authentication authentication = new UsernamePasswordAuthenticationToken(principalDetails, null, principalDetails.getAuthorities());

            // 강제로 시큐리티의 세션에 접근하여 Authentication 객체를 저장
            SecurityContextHolder.getContext().setAuthentication(authentication);


        }
        else {
            throw new CustomException(ErrorType.NOT_VALID_TOKEN);
        }
        chain.doFilter(request,response);
    }


}