package by.peretz90.musicmarket.service;

import by.peretz90.musicmarket.domain.Music;
import by.peretz90.musicmarket.domain.User;
import by.peretz90.musicmarket.repository.MusicRepo;
import by.peretz90.musicmarket.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class MusicService {

  public final MusicRepo musicRepo;
  public final UserRepo userRepo;

  @Value("${upload.path}")
  private String uploadPath;

  public List<Music> getAllMusic() {
    return musicRepo.findAll();
  }

  public void addMusic(Music music, String price, MultipartFile file, User user) throws IOException {
    if (file != null && !Objects.requireNonNull(file.getOriginalFilename()).isEmpty()) {

      File uploadDirectory = new File(uploadPath);
      if (!uploadDirectory.exists()) {
        uploadDirectory.mkdir();
      }
      String uuidFile = UUID.randomUUID().toString();
      String resultFilename = renameFile(file.getOriginalFilename(), uuidFile);

      file.transferTo(new File(uploadPath + "/" + resultFilename));
      music.setUrl(resultFilename);
      music.setUserAuthor(user);
      music.setPrice(new BigDecimal(price));
      musicRepo.save(music);
    }
  }

  private String renameFile(String originalName, String toName) {
    int index = originalName.lastIndexOf('.');
    String fileExtension = originalName.substring(index);
    return toName + fileExtension;
  }

  public void buyMusic(User user, Music music) {
    if (user.getMoney().compareTo(music.getPrice()) >= 0) {
      user.setMoney(user.getMoney().subtract(music.getPrice()));
      userRepo.save(user);
      music.getUserAuthor().setMoney(music.getUserAuthor().getMoney().add(music.getPrice()));
      music.getBuyers().add(user);
      user.getBuyingMusic().add(music);
      musicRepo.save(music);
    }
  }

  public List<Music> myMusic(User user) {
    return musicRepo.findByUserAuthor(user);
  }

  public void removeMusic(Music music) {
    music.setUserAuthor(null);
    musicRepo.save(music);
  }

  public List<Music> searchMusic(String inputSearch) {
    if (!inputSearch.isEmpty()) {
      List<Music> result = musicRepo.findByNameStartingWith(inputSearch);
      List<User> authorList = userRepo.findByUsernameStartingWith(inputSearch);
      for (User u : authorList) {
        List<Music> listMusic = musicRepo.findByUserAuthor(u);
        result = Stream.of(result, listMusic)
            .flatMap(Collection::stream)
            .collect(Collectors.toList());
      }
      return result;
    } else {
      return musicRepo.findAll();
    }
  }
}
