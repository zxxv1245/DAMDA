package back.shoppingMart.common.auth;

import back.shoppingMart.user.entity.OAuthProvider;

public interface OAuthInfoResponse {
    String getEmail();
    String getNickname();
    OAuthProvider getOAuthProvider();
}