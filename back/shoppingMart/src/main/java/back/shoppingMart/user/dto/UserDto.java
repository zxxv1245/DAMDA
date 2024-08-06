package back.shoppingMart.user.dto;

import back.shoppingMart.user.entity.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String password;
    private String email;
    private String roles;
    private LocalDate birthDate;
    private String provider;
    private String providerId;
    private String profileImg;
    private Boolean isAdult;

    @Builder
    public UserDto(Long id, String username, String password, String email, String roles, LocalDate birthDate, String provider, String providerId, String profileImg, Boolean isAdult) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.roles = roles;
        this.birthDate = birthDate;
        this.provider = provider;
        this.providerId = providerId;
        this.profileImg = profileImg;
        this.isAdult = isAdult;

    }



    public static UserDto of(String username) {
        return new UserDto(null, username, null, null,null,null,null, null, null, null);
    }


}
