package back.shoppingMart.user.service;

import back.shoppingMart.common.exception.CustomException;
import back.shoppingMart.common.exception.ErrorType;
import back.shoppingMart.common.mail.EmailVerificationResult;
import back.shoppingMart.common.mail.MailService;
import back.shoppingMart.common.redis.RedisService;
import back.shoppingMart.common.s3.S3Service;
import back.shoppingMart.user.dto.FindEmailDto;
import back.shoppingMart.user.repository.UserRepository;
import back.shoppingMart.user.dto.ChangePasswordDto;
import back.shoppingMart.user.dto.UserDto;
import back.shoppingMart.user.entity.User;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private static final String AUTH_CODE_PREFIX = "AuthCode ";

    private final UserRepository userRepository;
    private final MailService mailService;
    private final S3Service s3Service;
    private final RedisService redisService;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Value("${spring.mail.auth-code-expiration-millis}")
    private long authCodeExpirationMillis;

    // 회원 가입 로직
    public User registerUser(UserDto userDto) {
        checkIfEmailExists(userDto.getEmail());
        if (userDto.getEmail() == null || userDto.getEmail().isEmpty()) {
            throw new CustomException(ErrorType.NO_EMAIL_INPUT);
        }
        if (userDto.getPassword() == null || userDto.getPassword().isEmpty()) {
            throw new CustomException(ErrorType.NO_PSW_INPUT);
        }
        if (userDto.getNickname() == null || userDto.getNickname().isEmpty()) {
            throw new CustomException(ErrorType.NO_USERNAME_INPUT);
        }
        if (userDto.getUsername() == null || userDto.getUsername().isEmpty()) {
            throw new CustomException(ErrorType.NO_USERNAME_INPUT);
        }
        if (userDto.getPhoneNumber() == null || userDto.getPhoneNumber().isEmpty()) {
            throw new CustomException(ErrorType.NO_USERNAME_INPUT);
        }
        if (userDto.getBirthDate() == null) {
            throw new CustomException(ErrorType.NO_BIRTHDATE_INPUT);
        }
        this.checkIfEmailExists(userDto.getEmail());

        User user = new User();
        user.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        user.setEmail(userDto.getEmail());
        user.setNickname(userDto.getNickname());
        user.setUsername(userDto.getUsername());
        user.setBirthDate(userDto.getBirthDate());
        user.setRoles("ROLE_USER");
        user.setPhoneNumber(userDto.getPhoneNumber());
        return userRepository.save(user);
    }


    // username이 이미 있는지 확인
    public Boolean checkIfEmailExists(String email) {

        Boolean exists = userRepository.existsByEmail(email);
        if (exists) {
            throw new CustomException(ErrorType.DUPLICATED_EMAIL);
        } else {
            return exists;
        }
    }


    // Id로 유저 정보를 조회
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_USER));
        return new UserDto(user.getId(), user.getUsername(), user.getNickname(), user.getPassword(), user.getEmail(), user.getRoles(), user.getBirthDate(), user.getOAuthProvider(), user.getProfileImg(), user.getPhoneNumber(), user.getIsAdult());
    }

    // 회원 정보 수정 로직
    public UserDto updateUser(Long id, UserDto userDto)  {
        User user = userRepository.findById(id).orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_USER));
        user.setUsername(userDto.getUsername());
        user.setBirthDate(userDto.getBirthDate());
        user.setNickname(userDto.getNickname());
        user.setPhoneNumber(userDto.getPhoneNumber());
        User updatedUser = userRepository.save(user);

        return new UserDto(updatedUser.getId(), updatedUser.getNickname(), updatedUser.getUsername(), updatedUser.getPassword(), updatedUser.getEmail(), updatedUser.getRoles(), updatedUser.getBirthDate(), updatedUser.getOAuthProvider(), user.getProfileImg(), updatedUser.getPhoneNumber(), updatedUser.getIsAdult());
    }

    // 회원 프로필 사진 수정 로직
    public UserDto updateUserProfile(Long id, MultipartFile image) throws IOException {
        User user = userRepository.findById(id).orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_USER));

        // 기존 프로필 이미지가 있는 경우 삭제
        if (user.getProfileImg() != null && !user.getProfileImg().isEmpty()) {
            deleteImageFromS3(user.getProfileImg());
        }

        if (!image.isEmpty()){

            String profileImages = s3Service.upload(image, "profileImages");
            user.setProfileImg(profileImages);
        }else user.setProfileImg(null);
        User updatedUser = userRepository.save(user);

        return new UserDto(updatedUser.getId(), updatedUser.getNickname(), updatedUser.getUsername(), updatedUser.getPassword(), updatedUser.getEmail(), updatedUser.getRoles(), updatedUser.getBirthDate(), updatedUser.getOAuthProvider(), user.getProfileImg(), updatedUser.getPhoneNumber(), updatedUser.getIsAdult());
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

    public void sendCodeToEmail(String toEmail) {
        this.checkIfEmailExists(toEmail);
        String title = "Damda 이메일 인증 번호";
        String authCode = this.createCode();

        // 템플릿에 전달할 변수 설정
        Map<String, Object> variables = new HashMap<>();
        variables.put("verificationCode", authCode);

        // email.html 템플릿을 사용하여 이메일 전송
        mailService.sendEmail(toEmail, title, "email", variables);

        // 이메일 인증 요청 시 인증 번호 Redis에 저장 ( key = "AuthCode " + Email / value = AuthCode )
        redisService.setValues(AUTH_CODE_PREFIX + toEmail,
                authCode, Duration.ofMillis(this.authCodeExpirationMillis));
    }

    private String createCode() {
        int lenth = 6;
        try {
            Random random = SecureRandom.getInstanceStrong();
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < lenth; i++) {
                builder.append(random.nextInt(10));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new CustomException(ErrorType.NO_SUCH_ALGORITHM);
        }
    }
    public EmailVerificationResult verifiedCode(String email, String authCode) {
        this.checkIfEmailExists(email);
        String redisAuthCode = redisService.getValues(AUTH_CODE_PREFIX + email);
        boolean authResult = redisService.checkExistsValue(redisAuthCode) && redisAuthCode.equals(authCode);

        return EmailVerificationResult.of(authResult);
    }

    // S3에서 파일 삭제
    private void deleteImageFromS3(String imageUrl) {
        String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1); // 파일 이름 추출
        System.out.println(fileName);
        String dirName = "profileImages"; // 업로드된 폴더명

        s3Service.deleteFile(dirName + "/" + fileName);
    }

    public String FindEmail(FindEmailDto findEmailDto){
        User findingUser = userRepository.findByUsernameAndPhoneNumber(findEmailDto.getUsername(), findEmailDto.getPhoneNumber());
        if (findingUser == null) {
            throw new CustomException(ErrorType.NOT_FOUND_USER);
        }
        return findingUser.getEmail();

    }

    public void sendNewPasswordToEmail(String toEmail) {
        User user = userRepository.findByEmail(toEmail);
        if (user == null) {
            throw new CustomException(ErrorType.NOT_FOUND_USER);
        }
        String title = "새로운 비밀번호";
        String newPassword = this.createCode();
        user.setPassword(bCryptPasswordEncoder.encode(newPassword));

        // 템플릿에 전달할 변수 설정
        Map<String, Object> variables = new HashMap<>();
        variables.put("newPassword", newPassword);

        // passwordEmail.html 템플릿을 사용하여 이메일 전송
        mailService.sendEmail(toEmail, title, "passwordEmail", variables);
    }

}


