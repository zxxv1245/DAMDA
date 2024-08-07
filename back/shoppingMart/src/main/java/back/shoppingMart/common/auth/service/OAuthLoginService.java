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
        Long memberId = findOrCreateUser(oAuthInfoResponse);
        return authTokensGenerator.generate(memberId);
    }

    private Long findOrCreateUser(OAuthInfoResponse oAuthInfoResponse) {
        User user = userRepository.findByEmail(oAuthInfoResponse.getEmail());
        if (user != null) {
            return user.getId();
        } else {
            return newUser(oAuthInfoResponse);
        }
    }

    private Long newUser(OAuthInfoResponse oAuthInfoResponse) {
        User user = User.builder()
                .email(oAuthInfoResponse.getEmail())
                .username(oAuthInfoResponse.getUsername())
                .oAuthProvider(oAuthInfoResponse.getOAuthProvider())
                .build();

        return userRepository.save(user).getId();
    }
}