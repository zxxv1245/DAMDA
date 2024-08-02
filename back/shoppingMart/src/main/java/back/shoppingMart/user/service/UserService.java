package back.shoppingMart.user.service;

import back.shoppingMart.common.exception.CustomException;
import back.shoppingMart.common.exception.ErrorType;
import back.shoppingMart.user.repository.UserRepository;
import back.shoppingMart.user.dto.ChangePasswordDto;
import back.shoppingMart.user.dto.UserDto;
import back.shoppingMart.user.entity.User;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class UserService {


    private final UserRepository userRepository;


    private final BCryptPasswordEncoder bCryptPasswordEncoder;


    // 회원 가입 로직
    public User registerUser(UserDto userDto) {
        checkIfEmailExists(userDto.getEmail());
        if (userDto.getEmail() == null || userDto.getEmail().isEmpty()) {
            throw new CustomException(ErrorType.NO_EMAIL_INPUT);
        }
        if (userDto.getPassword() == null || userDto.getPassword().isEmpty()) {
            throw new CustomException(ErrorType.NO_PSW_INPUT);
        }
        if (userDto.getUsername() == null || userDto.getUsername().isEmpty()) {
            throw new CustomException(ErrorType.NO_USERNAME_INPUT);
        }
        if (userDto.getBirthDate() == null) {
            throw new CustomException(ErrorType.NO_BIRTHDATE_INPUT);
        }
        User user = new User();
        user.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        user.setEmail(userDto.getEmail());
        user.setUsername(userDto.getUsername());
        user.setBirthDate(userDto.getBirthDate());
        user.setRoles("ROLE_USER");
        return userRepository.save(user);
    }


    // username이 이미 있는지 확인
    public Boolean checkIfEmailExists(String email) {

        return userRepository.existsByEmail(email);
    }

    // Id로 유저 정보를 조회
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_USER));
        return new UserDto(user.getId(), user.getUsername(), user.getPassword(), user.getEmail(), user.getRoles(), user.getBirthDate(), user.getProvider(), user.getIsAdult());
    }

    // 회원 정보 수정 로직
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id).orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_USER));
        user.setEmail(userDto.getEmail());
        user.setBirthDate(userDto.getBirthDate());
        User updatedUser = userRepository.save(user);
        return new UserDto(updatedUser.getId(), updatedUser.getUsername(), updatedUser.getPassword(), updatedUser.getEmail(), updatedUser.getRoles(), updatedUser.getBirthDate(), updatedUser.getProvider(), updatedUser.getIsAdult());
    }

    // 회원 탈퇴 로직
    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_USER));
        userRepository.deleteById(id);
    }


    // 비밀번호 변경 로직
    public void changePassword(Long id, ChangePasswordDto changePasswordDto) {
        User user = userRepository.findById(id).orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_USER));
        // 현재 비밀번호 확인
        if (!bCryptPasswordEncoder.matches(changePasswordDto.getCurrentPassword(), user.getPassword())) {
            throw new CustomException(ErrorType.PSW_DIFFERENT);
        }
        // 새로운 비밀번호로 변경
        user.setPassword(bCryptPasswordEncoder.encode(changePasswordDto.getNewPassword()));
        userRepository.save(user);
    }


}
