package by.peretz90.musicmarket.service;

import by.peretz90.musicmarket.domain.Music;
import by.peretz90.musicmarket.domain.User;
import by.peretz90.musicmarket.domain.UserRole;
import by.peretz90.musicmarket.repository.MusicRepo;
import by.peretz90.musicmarket.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

  public final UserRepo userRepo;
  public final PasswordEncoder passwordEncoder;
  public final MailSenderService mailSenderService;
  public final MusicRepo musicRepo;

  public List<User> users() {
    return userRepo.findAll();
  }

  public void addUser(User user) {
    if (user.getPassword().equals(user.getConfirmPassword())) {
      user.setActivationCode(UUID.randomUUID().toString());
      user.setActive(false);
      user.setRoles(Collections.singleton(UserRole.ROLE_USER));
      user.setPassword(passwordEncoder.encode(user.getPassword()));
      user.setMoney(new BigDecimal("0.00"));
      userRepo.save(user);
      sendMessage(user);
    }
  }

  private void sendMessage(User user){
    if(!StringUtils.isEmpty(user.getUsername())){

      String message = String.format(
          "Hello, %s! \n" +
              "Welcome to music market. Please visit next link http://localhost:8080/activate/%s",
          user.getUsername(),
          user.getActivationCode()
      );

      mailSenderService.send(user.getUsername(), "Activation code", message);
    }
  }

  public void addUser(OAuth2User principal) {
    if (principal.getAttribute("email") != null) {
      User user = new User();
      String name = principal.getAttribute("name");
      if (name != null) {
        int index = name.indexOf(' ');
        user.setFirstName(name.substring(0, index));
        user.setLastName(name.substring(index + 1));
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

  public boolean activateUser(String code) {
    User userByCode = userRepo.findByActivationCode(code);

    if (userByCode == null){
      return false;
    } else {

      userByCode.setActivationCode(null);
      userByCode.setActive(true);
      userRepo.save(userByCode);

      return true;
    }
  }

  public User saveUser(User userEdit, User user, Map<String, String> form) {
    BeanUtils.copyProperties(userEdit, user,
        "id",
        "username",
        "password",
        "active",
        "roles",
        "createdDate",
        "updateDate",
        "subscriptions",
        "subscribers",
        "buyingMusic",
        "money"
    );
    Set<String> roles = Arrays.stream(UserRole.values())
        .map(UserRole::name)
        .collect(Collectors.toSet());
    user.getRoles().clear();
    for(String key : form.keySet()) {
      if (roles.contains(key)) {
        user.getRoles().add(UserRole.valueOf(key));
      }
    }
    return userRepo.save(user);
  }

  public User editProfile(User user, User authUser, String username, String password, String firstName, String lastName, String birthday) {
    if (user.getId().equals(authUser.getId())) {
      if (username != null && password != null) {
        if (passwordEncoder.matches(password, user.getPassword())) {
          user.setUsername(username);
          user.setActivationCode(UUID.randomUUID().toString());
          user.setActive(false);
          userRepo.save(user);
          sendMessage(user);
        }
      } else {
        user.setFirstName(firstName);
        user.setLastName(lastName);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate birthDate = LocalDate.parse(birthday, formatter);
        user.setBirthday(birthDate);
        userRepo.save(user);
      }
    }
    return user;
  }

  public Set<User> subscribersUsers(User user) {
    return user.getSubscribers();
  }

  public Set<User> subscriptionsUsers(User user) {
    return user.getSubscriptions();
  }

  public void subscribeUser(User user, String username) {
    User userId = userRepo.findByUsername(username);
    userId.getSubscribers().add(user);
    user.getSubscriptions().add(userId);
    userRepo.save(userId);
  }

  public void unsubscribeUser(User user, String username) {
    User userId = userRepo.findByUsername(username);
    userId.getSubscribers().remove(user);
    user.getSubscriptions().remove(userId);
    userRepo.save(userId);
  }

  public Set<Music> getAuthArr(User user) {
    return user.getBuyingMusic();
  }

  public void removeBuyer(User user, Music music) {
    music.getBuyers().remove(user);
    user.getBuyingMusic().remove(music);
    userRepo.save(user);
  }
}
