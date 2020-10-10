package by.peretz90.musicmarket.Service;

import by.peretz90.musicmarket.Domain.User;
import by.peretz90.musicmarket.Domain.UserRole;
import by.peretz90.musicmarket.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

  public final UserRepo userRepo;

  public List<User> users() {
    return userRepo.findAll();
  }

  public User addUser(User user) {
    user.setActive(true);
    user.setRoles(Collections.singleton(UserRole.ROLE_USER));
    return userRepo.save(user);
  }

  public User addUser(OAuth2AuthenticatedPrincipal userOauth2) {
    int index = 0;
    String name = userOauth2.getAttribute("name");
    if (name != null) {
      index = name.indexOf(" ");
    }
    User user = new User();
    user.setUsername(userOauth2.getAttribute("email"));
    user.setLastName(name != null ? name.substring(0, index) : null);
    user.setFirstName(name != null ? name.substring(index+1) : null);
    user.setPassword("%|D{jeapdO?@xm$V~EVT}fED24H*7@TP~Yuu{4bc@65tIXLlXt");
    return userRepo.save(user);
  }

}
