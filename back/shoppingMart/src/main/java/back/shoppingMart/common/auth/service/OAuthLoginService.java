package back.shoppingMart.common.auth.service;

import back.shoppingMart.common.auth.*;
import back.shoppingMart.user.entity.User;
import back.shoppingMart.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OAuthLoginService {
    private final UserRepository userRepository;
    private final AuthTokensGenerator authTokensGenerator;
    private final RequestOAuthInfoService requestOAuthInfoService;

    public AuthTokens login(OAuthLoginParams params) {
        OAuthInfoResponse oAuthInfoResponse = requestOAuthInfoService.request(params);
        String email = findOrCreateUser(oAuthInfoResponse);
        return authTokensGenerator.generate(email);
    }

    private String findOrCreateUser(OAuthInfoResponse oAuthInfoResponse) {
        User user = userRepository.findByEmail(oAuthInfoResponse.getEmail());
        if (user != null) {
            return user.getEmail();
        } else {
            return newUser(oAuthInfoResponse);
        }
    }

    private String newUser(OAuthInfoResponse oAuthInfoResponse) {
        User user = User.builder()
                .email(oAuthInfoResponse.getEmail())
                .nickname(oAuthInfoResponse.getNickname())
                .oAuthProvider(oAuthInfoResponse.getOAuthProvider())
                .roles("ROLE_USER")
                .build();

        return userRepository.save(user).getEmail();
    }
}