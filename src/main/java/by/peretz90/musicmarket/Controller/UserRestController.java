package by.peretz90.musicmarket.Controller;

import by.peretz90.musicmarket.Domain.User;
import by.peretz90.musicmarket.Domain.UserRole;
import by.peretz90.musicmarket.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserRestController {

  public final UserService userService;

  @GetMapping
  public List<User> user() {
    return userService.users();
  }

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

}
