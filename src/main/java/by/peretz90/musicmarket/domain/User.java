package by.peretz90.musicmarket.domain;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@EqualsAndHashCode(callSuper = true, of = { "id" })
@Entity
@Table(name = "users")
@Data
public class User extends AbstractEntity implements UserDetails, Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Email
  @Column(unique = true)
  private String username;

  @NotBlank
  private String password;

  @Transient
  private String confirmPassword;

  @DateTimeFormat(pattern = "yyyy-MM-dd")
  private LocalDate birthday;

  private String firstName;
  private String lastName;

  private String activationCode;

  private boolean active;

  @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
  @JoinTable(
      name = "user_subscriptions",
      joinColumns = @JoinColumn(name = "subscriber_id"),
      inverseJoinColumns = @JoinColumn(name = "channel_id")
  )
  @JsonIdentityReference
  @JsonIdentityInfo(
      property = "id",
      generator = ObjectIdGenerators.PropertyGenerator.class
  )
  private Set<User> subscriptions = new HashSet<>();

  @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
  @JoinTable(
      name = "user_subscriptions",
      joinColumns = @JoinColumn(name = "channel_id"),
      inverseJoinColumns = @JoinColumn(name = "subscriber_id")
  )
  @JsonIdentityReference
  @JsonIdentityInfo(
      property = "id",
      generator = ObjectIdGenerators.PropertyGenerator.class
  )
  private Set<User> subscribers = new HashSet<>();

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
