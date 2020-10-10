package by.peretz90.musicmarket.Controller;

import by.peretz90.musicmarket.Service.MusicService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
@RequiredArgsConstructor
public class MainController {

  public final MusicService musicService;

  @GetMapping
  public String main() {
    return "index";
  }

  @GetMapping("/registration")
  public String addUser(Model model, @AuthenticationPrincipal OAuth2AuthenticatedPrincipal userOAuth2) {
    if (userOAuth2 != null && userOAuth2.getAttribute("email") != null) {
      model.addAttribute("email", userOAuth2.getAttribute("email"));
    } else {
      model.addAttribute("email", "");
    }
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

}
