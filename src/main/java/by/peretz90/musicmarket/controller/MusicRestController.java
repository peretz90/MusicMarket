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
import java.util.Set;

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
      @RequestParam String price,
      @Valid Music music
  ) throws IOException {
    musicService.addMusic(music, price, file, user);
  }

  @PutMapping("/{id}")
  public void buyMusic(
      @AuthenticationPrincipal User user,
      @PathVariable("id") Music music
  ) {
    musicService.buyMusic(user, music);
  }

  @DeleteMapping("{id}")
  public void removeMusic(@PathVariable("id") Music music) {
    musicService.removeMusic(music);
  }

  @GetMapping("/my-music")
  public List<Music> listMyMusic(@AuthenticationPrincipal User user) {
    return musicService.myMusic(user);
  }

  @GetMapping("/music-author/{id}")
  public List<Music> listMusicAuthor(@PathVariable("id") User user) {
    return musicService.myMusic(user);
  }

  @GetMapping("/purchased-music")
  public Set<Music> listPurchasedMusic(@AuthenticationPrincipal User user) {
    return user.getBuyingMusic();
  }

  @GetMapping("/search/{input}")
  public List<Music> listMusicSearch(@PathVariable("input") String inputSearch) {
    return musicService.searchMusic(inputSearch);
  }

  @GetMapping("/search")
  public List<Music> allMusicSearch() {
    return musicService.getAllMusic();
  }

}
