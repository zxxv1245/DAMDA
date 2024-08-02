package back.shoppingMart.common.auth;

import back.shoppingMart.common.exception.CustomException;
import back.shoppingMart.common.exception.ErrorType;
import back.shoppingMart.user.entity.User;
import back.shoppingMart.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PrincipalDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User userEntity =userRepository.findByEmail(email);
        if (userEntity == null) {
            throw new CustomException(ErrorType.EMAIL_NOT_FOUND);
        }
        return new PrincipalDetails(userEntity);
    }
}
