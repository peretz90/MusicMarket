package by.peretz90.musicmarket.Domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.Transient;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.transaction.Transactional;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "users")
@Data
@ToString
public class User extends AbstractEntity implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Email
  @Column(unique = true)
  private String username;

  @NotBlank
  private String password;

  @DateTimeFormat(pattern = "yyyy-MM-dd")
  private LocalDate birthday;

  private String firstName;
  private String lastName;

  private String activationCode;

  private boolean active;

  @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, targetEntity = User.class)
  @JoinTable(
      name = "users_set",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "sub_user_id")
  )
  private Set<User> userSet = new HashSet<>();

  @ElementCollection(targetClass = UserRole.class, fetch = FetchType.EAGER)
  @Enumerated(EnumType.STRING)
  @CollectionTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"))
  private Set<UserRole> roles;

  public boolean isAdmin() {
    return roles.contains(UserRole.ROLE_ADMIN);
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return getRoles();
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return active;
  }
}
