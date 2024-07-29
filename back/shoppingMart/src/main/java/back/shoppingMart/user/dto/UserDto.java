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
    private Boolean isAdult;


    @Builder
    public UserDto(Long id, String username, String password, String email, String roles, LocalDate birthDate, String provider, Boolean isAdult) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.roles = roles;
        this.birthDate = birthDate;
        this.provider = provider;
        this.isAdult = isAdult;

    }
    // User 엔티티를 UserDto로 변환하는 팩토리 메소드
    public static UserDto fromEntity(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .password(user.getPassword())
                .email(user.getEmail())
                .roles(user.getRoles())
                .birthDate(user.getBirthDate())
                .provider(user.getProvider())
                .build();
    }

    // UserDto를 User 엔티티로 변환하는 팩토리 메소드
    public User toEntity() {
        return User.builder()
                .id(id)
                .username(username)
                .password(password)
                .email(email)
                .roles(roles)
                .birthDate(birthDate)
                .provider(provider)
                .build();
    }

    public static UserDto of(String username) {
        return new UserDto(null, username, null, null,null,null,null, null);
    }


}
