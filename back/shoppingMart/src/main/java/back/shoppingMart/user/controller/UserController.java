package back.shoppingMart.user.controller;
import back.shoppingMart.common.auth.PrincipalDetails;
import back.shoppingMart.common.response.MsgType;
import back.shoppingMart.common.response.ResponseEntityDto;
import back.shoppingMart.common.response.ResponseUtils;
import back.shoppingMart.user.dto.UserDto;
import back.shoppingMart.user.service.UserService;
import back.shoppingMart.user.dto.ChangePasswordDto;
import back.shoppingMart.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;



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


}
