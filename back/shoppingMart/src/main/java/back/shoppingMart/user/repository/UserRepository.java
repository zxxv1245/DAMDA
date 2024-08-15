package back.shoppingMart.user.repository;


import back.shoppingMart.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    public User findByUsernameAndPhoneNumber(String username, String phoneNumber);


    public User findByEmail(String email);

    boolean existsByEmail(String email);
}
