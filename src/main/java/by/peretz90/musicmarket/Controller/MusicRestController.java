package by.peretz90.musicmarket.Controller;

import by.peretz90.musicmarket.Domain.Music;
import by.peretz90.musicmarket.Domain.User;
import by.peretz90.musicmarket.Service.MusicService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/music")
@RequiredArgsConstructor
public class MusicRestController {

  public final MusicService musicService;

  @GetMapping
  public List<Music> listMusic() {
    System.out.println(musicService.getAllMusic());
    return musicService.getAllMusic();
  }

  @PostMapping
  public Music addMusic(
      @AuthenticationPrincipal User user,
      @RequestParam MultipartFile file,
      @Valid Music music
  ) throws IOException {
    return musicService.addMusic(music, file, user);
  }

}
