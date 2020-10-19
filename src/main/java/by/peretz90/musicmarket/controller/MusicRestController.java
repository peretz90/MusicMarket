package by.peretz90.musicmarket.controller;

import by.peretz90.musicmarket.domain.Music;
import by.peretz90.musicmarket.domain.User;
import by.peretz90.musicmarket.service.MusicService;
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
    return musicService.getAllMusic();
  }

  @PostMapping
  public void addMusic(
      @AuthenticationPrincipal User user,
      @RequestParam MultipartFile file,
      @Valid Music music
  ) throws IOException {
    musicService.addMusic(music, file, user);
  }

}
