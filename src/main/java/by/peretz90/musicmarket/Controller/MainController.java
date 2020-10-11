package by.peretz90.musicmarket.Controller;

import by.peretz90.musicmarket.Repository.UserRepo;
import by.peretz90.musicmarket.Service.MusicService;
import by.peretz90.musicmarket.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
@RequiredArgsConstructor
public class MainController {

  public final MusicService musicService;
  public final UserRepo userRepo;
  public final UserService userService;

  @GetMapping
  public String main() {
    return "index";
  }

  @GetMapping("/registration")
  public String addUser() {
    return "registration";
  }

  @GetMapping("/musics")
  public String musics(Model model) {
    model.addAttribute("musics", musicService.getAllMusic());
    return "musics";
  }

  @GetMapping("/musics/add")
  public String musicsAdd() {
    return "musicForm";
  }

  @GetMapping("/success")
  public String success() {
    return "success";
  }

  @GetMapping("/success/oauth2")
  public String successOAuth2(
      Model model,
      @AuthenticationPrincipal OAuth2User principal
  ) {
    if (principal.getAttribute("email") != null && userRepo.findByUsername(principal.getAttribute("email")) == null) {
      model.addAttribute("email", principal.getAttribute("email"));
      model.addAttribute("password", "raM3x41vtF4q|Qf|RBc9Aiunu$U5MmVQLxjsG~XO#~kz4G$Vi?");
      userService.addUser(principal);
    } else if (userRepo.findByUsername(principal.getAttribute("email")) != null) {
      model.addAttribute("email", principal.getAttribute("email"));
      model.addAttribute("password", "raM3x41vtF4q|Qf|RBc9Aiunu$U5MmVQLxjsG~XO#~kz4G$Vi?");
    } else {
      model.addAttribute("email", null);
      model.addAttribute("password", null);
    }
    return "successOauth2";
  }

}
