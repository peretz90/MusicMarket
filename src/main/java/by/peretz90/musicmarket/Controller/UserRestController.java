package by.peretz90.musicmarket.Controller;

import by.peretz90.musicmarket.Domain.User;
import by.peretz90.musicmarket.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserRestController {

  public final UserService userService;

  @GetMapping
  public List<User> user() {
    return userService.users();
  }

  @PostMapping
  public void addUser(
      @Valid User user
  ) {
    userService.addUser(user);
  }

}
