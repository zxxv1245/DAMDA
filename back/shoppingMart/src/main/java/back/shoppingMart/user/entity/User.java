package back.shoppingMart.user.entity;



import back.shoppingMart.purchase.entity.Purchase;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@Data
@Entity
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String email;
    private String roles; // USER, ADMIN
    private LocalDate birthDate;
    private Boolean isAdult;
    private String provider;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<Purchase> purchases = new ArrayList<>();

    @Builder
    private User(Long id, String username, String password, String email, String roles, LocalDate birthDate, String provider) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.roles = roles;
        this.birthDate = birthDate;
        this.provider = provider;

    }

    public User() {
    }

    public List<String> getRoleList() {
        if (this.roles.length() > 0) {
            return Arrays.asList(this.roles.split(","));
        }
        return new ArrayList<>();
    }

    @PrePersist
    @PreUpdate
    private void calculateIsAdult() {
        this.isAdult = calculateAdult(this.birthDate);
    }

    private Boolean calculateAdult(LocalDate birthDate) {
        if (birthDate == null) return false;
        LocalDate today = LocalDate.now();
        int age = Period.between(birthDate, today).getYears();
        return age >= 18;
    }
}
