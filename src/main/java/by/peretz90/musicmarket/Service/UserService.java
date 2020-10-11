package by.peretz90.musicmarket.Service;

import by.peretz90.musicmarket.Domain.User;
import by.peretz90.musicmarket.Domain.UserRole;
import by.peretz90.musicmarket.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

  public final UserRepo userRepo;
  public final PasswordEncoder passwordEncoder;

  public List<User> users() {
    return userRepo.findAll();
  }

  public void addUser(User user) {
    user.setActive(true);
    user.setRoles(Collections.singleton(UserRole.ROLE_USER));
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    userRepo.save(user);
  }

  public void addUser(OAuth2User principal) {
    if (principal.getAttribute("email") != null) {
      User user = new User();
      String name = principal.getAttribute("name");
      if (name != null) {
        int index = name.indexOf(' ');
        user.setLastName(name.substring(0, index));
        user.setFirstName(name.substring(index + 1));
      }
      user.setUsername(principal.getAttribute("email"));
      user.setPassword(passwordEncoder.encode("raM3x41vtF4q|Qf|RBc9Aiunu$U5MmVQLxjsG~XO#~kz4G$Vi?"));
      user.setRoles(Collections.singleton(UserRole.ROLE_USER));
      user.setActive(true);
      userRepo.save(user);
    }
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepo.findByUsername(username);
    if (user == null){
      throw new UsernameNotFoundException("User not found");
    }

    return user;
  }
}
