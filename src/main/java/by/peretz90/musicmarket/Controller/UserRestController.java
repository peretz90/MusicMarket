package by.peretz90.musicmarket.Controller;

import by.peretz90.musicmarket.Domain.User;
import by.peretz90.musicmarket.Domain.UserRole;
import by.peretz90.musicmarket.Repository.UserRepo;
import by.peretz90.musicmarket.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserRestController {

  public final UserService userService;
  public final UserRepo userRepo;

  @GetMapping
  public List<User> user() {
    return userService.users();
  }

  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  @PutMapping("/edit/{id}")
  public User userEditOne(
      @Valid User userEdit,
      @PathVariable("id") User user,
      @RequestParam Map<String, String> form
  ) {
    return userService.saveUser(userEdit, user, form);
  }

  @GetMapping("/edit")
  public User userGetOne(@AuthenticationPrincipal User user) {
    return user;
  }

  @GetMapping("/roles")
  public UserRole[] roles() {
    return UserRole.values();
  }

  @PostMapping
  public void addUser(
      @Valid User user
  ) {
    userService.addUser(user);
  }

  @GetMapping("/{id}")
  public User getUserProfile(
      @PathVariable("id") User user
  ) {
    return user;
  }

  @PutMapping("/profile/{id}")
  public User editProfile(
      @PathVariable("id") User user,
      @AuthenticationPrincipal User authUser,
      @RequestParam(name = "username", required = false) String username,
      @RequestParam(name = "password", required = false) String password,
      @RequestParam(name = "firstName", required = false) String firstName,
      @RequestParam(name = "lastName", required = false) String lastName,
      @RequestParam(name = "birthday", required = false) String birthday
  ) {
    return userService.editProfile(user, authUser,username, password, firstName, lastName, birthday);
  }

  @GetMapping("/profile/subscribers")
  public List<User> subscribersUsers(@AuthenticationPrincipal User user) {
    return userService.subscribersUsers(user);
  }

  @PostMapping("/profile/subscribers")
  public User subscribeUser(
      @AuthenticationPrincipal User user,
      @RequestParam("username") String username
  ) {
    return userService.subscribeUser(user, username);
  }

  @DeleteMapping("/profile/unsubscribe")
  public void unsubscribeUser(
      @AuthenticationPrincipal User user,
      @RequestParam("username") String username
  ) {
    userService.unsubscribeUser(user, username);
  }

  @GetMapping("/profile/subscriptions")
  public List<User> subscriptionsUsers(@AuthenticationPrincipal User user) {
    return userService.subscriptionsUsers(user);
  }

}
