package back.shoppingMart.user.controller;
import back.shoppingMart.common.auth.PrincipalDetails;
import back.shoppingMart.common.mail.CustomEmail;
import back.shoppingMart.common.mail.EmailVerificationResult;
import back.shoppingMart.common.response.MsgType;
import back.shoppingMart.common.response.ResponseEntityDto;
import back.shoppingMart.common.response.ResponseUtils;
import back.shoppingMart.user.dto.FindEmailDto;
import back.shoppingMart.user.dto.UserDto;
import back.shoppingMart.user.service.UserService;
import back.shoppingMart.user.dto.ChangePasswordDto;
import back.shoppingMart.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class UserController {

    private final UserService userService;

    // 회원 가입
    @PostMapping("/register")
    public ResponseEntityDto<User> register(@RequestBody UserDto userDto) {
        User savedUser = userService.registerUser(userDto);
        return ResponseUtils.ok(savedUser, MsgType.DATA_SUCCESSFULLY);
    }

    // 회원 정보 조회
    @GetMapping("/user/profile")
    public ResponseEntityDto<UserDto> getUserProfile(@AuthenticationPrincipal PrincipalDetails principalDetails) {
        UserDto user = userService.getUserById(principalDetails.getUser().getId());
        return ResponseUtils.ok(user, MsgType.SEARCH_SUCCESSFULLY);
    }

    // 회원 정보 수정
    @PutMapping("/user/update")
    public ResponseEntityDto<UserDto> updateUser(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                                 @RequestBody UserDto userDto) {
        UserDto updatedUser = userService.updateUser(principalDetails.getUser().getId(), userDto);
        return ResponseUtils.ok(updatedUser, MsgType.UPDATED_SUCCESSFULLY);
    }
    // 회원 프로필 이미지 수정
    @PostMapping(value = "/user/update/profileImg", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntityDto<UserDto> updateUser(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                                 @RequestPart(value = "image") MultipartFile image) throws IOException {
        UserDto updatedUser = userService.updateUserProfile(principalDetails.getUser().getId(), image);
        return ResponseUtils.ok(updatedUser, MsgType.UPDATED_SUCCESSFULLY);
    }

    // 회원 탈퇴
    @DeleteMapping("/user/delete")
    public ResponseEntityDto<Void> deleteUser(@AuthenticationPrincipal PrincipalDetails principalDetails) {
        userService.deleteUser(principalDetails.getUser().getId());
        return ResponseUtils.ok(MsgType.DELETED_SUCCESSFULLY);
    }

    // 비밀번호 변경
    @PutMapping("/user/password")
    public ResponseEntityDto<Void> changePassword(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                                  @RequestBody ChangePasswordDto changePasswordDto) {
        userService.changePassword(principalDetails.getUser().getId(), changePasswordDto);
        return ResponseUtils.ok(MsgType.PSW_CHANGED_SUCCESSFULLY);
    }


    @GetMapping("/{email}/exists")
    public ResponseEntityDto<Boolean> checkEmailDuplicate(@PathVariable("email") String email) {
        Boolean emailExist = userService.checkIfEmailExists(email);
        return ResponseUtils.ok(emailExist, MsgType.DUPLICATION_TEST_COMPLETE);
    }


    @PostMapping("/emails/verification-requests")
    public ResponseEntityDto<Void> sendMessage(@RequestParam("email") @Valid @CustomEmail String email) {
        userService.sendCodeToEmail(email);
        return ResponseUtils.ok(MsgType.EMAIL_SUCCESSFULLY_SENT);
    }


    @GetMapping("/emails/verifications")
    public ResponseEntityDto<EmailVerificationResult> verificationEmail(@RequestParam("email") @Valid @CustomEmail String email,
                                            @RequestParam("code") String authCode) {
        EmailVerificationResult response = userService.verifiedCode(email, authCode);

        return ResponseUtils.ok(response, MsgType.EMAIL_SUCCESSFULLY_SENT);
    }

    @GetMapping("/getEmail")
    public ResponseEntityDto<String> getEmail(@RequestBody FindEmailDto findEmailDto) {
        String email = userService.FindEmail(findEmailDto);
        return ResponseUtils.ok(email, MsgType.EMAIL_SEARCHED_SUCCESSFULLY);
    }

    @PostMapping("/newPassword")
    public ResponseEntityDto<Void> sendNewPassword(@RequestParam("email") @Valid @CustomEmail String email) {
        userService.sendNewPasswordToEmail(email);
        return ResponseUtils.ok(MsgType.EMAIL_SUCCESSFULLY_SENT);
    }

}
