package back.shoppingMart.user.dto;

import back.shoppingMart.user.entity.OAuthProvider;
import back.shoppingMart.user.entity.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String nickname;
    private String password;
    private String email;
    private String roles;
    private LocalDate birthDate;
    private OAuthProvider oAuthProvider;
    private String profileImg;
    private String phoneNumber;
    private Boolean isAdult;

    @Builder
    public UserDto(Long id, String username, String nickname, String password, String email, String roles, LocalDate birthDate, OAuthProvider oAuthProvider , String profileImg, String phoneNumber, Boolean isAdult) {
        this.id = id;
        this.nickname = nickname;
        this.username = username;
        this.password = password;
        this.email = email;
        this.roles = roles;
        this.birthDate = birthDate;
        this.oAuthProvider = oAuthProvider;
        this.profileImg = profileImg;
        this.phoneNumber = phoneNumber;
        this.isAdult = isAdult;

    }




}
