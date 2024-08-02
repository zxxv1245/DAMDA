package back.shoppingMart.common.jwt;

public interface JwtProperties {

    String SECRET = "C103";
    int EXPIRATION_TIME = 60000 * 60; // 1 시간
    String TOKEN_PREFIX = "Bearer ";
    String HEADER_STRING = "Authorization";
}