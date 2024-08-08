package back.shoppingMart.common.config;

import back.shoppingMart.common.auth.AuthTokensGenerator;
import back.shoppingMart.common.jwt.JwtAuthenticationFilter;
import back.shoppingMart.common.jwt.JwtAuthorizationFilter;
import back.shoppingMart.common.jwt.JwtTokenProvider;
import back.shoppingMart.common.redis.RedisService;
import back.shoppingMart.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CorsFilter corsFilter;
    private final AuthenticationConfiguration authenticationConfiguration; // 인증 설정
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthTokensGenerator authTokensGenerator;
    private final RedisService redisService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        AuthenticationManager authenticationManager = authenticationConfiguration.getAuthenticationManager();

        http.csrf(csrf -> csrf.disable());

        // 세션 사용 X
        http.sessionManagement(session -> {
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        });

        // 서버는 CORS 정책에서 벗어날 수 있다.
        http.addFilterBefore(corsFilter, JwtAuthenticationFilter.class);
        http.addFilter(new JwtAuthenticationFilter(authenticationManager,jwtTokenProvider, authTokensGenerator,"/api/v1/login"));
        http.addFilter(new JwtAuthorizationFilter(authenticationManager, userRepository, jwtTokenProvider,redisService,authTokensGenerator));

        // form 로그인 사용하지 않는다
        http.formLogin(formLogin -> formLogin.disable());
        // HTTP Basic 인증 비활성화
        http.httpBasic(httpBasic -> httpBasic.disable());


        // URL 경로에 따른 접근 권한 설정
        http.authorizeRequests(request -> {
            request.requestMatchers("/api/v1/getDiscounts").permitAll();
            // /api/v1/user/** 경로는 ROLE_USER, ROLE_MANAGER, ROLE_ADMIN 권한을 가진 사용자만 접근 가능
            request.requestMatchers("/api/v1/user/**").access("hasRole('ROLE_USER') or hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')");
            // /api/v1/manager/** 경로는 ROLE_MANAGER, ROLE_ADMIN 권한을 가진 사용자만 접근 가능
            request.requestMatchers("/api/v1/manager/**").access("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')");
            // /api/v1/admin/** 경로는 ROLE_ADMIN 권한을 가진 사용자만 접근 가능
            request.requestMatchers("/api/v1/admin/**").access("hasRole('ROLE_ADMIN')");
            // 루트 경로는 모든 사용자 접근 가능
            request.requestMatchers("/").permitAll();

        });

        return http.build();
    }
}
