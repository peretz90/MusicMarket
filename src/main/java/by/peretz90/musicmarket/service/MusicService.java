package by.peretz90.musicmarket.service;

import by.peretz90.musicmarket.domain.Music;
import by.peretz90.musicmarket.domain.User;
import by.peretz90.musicmarket.repository.MusicRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MusicService {

  public final MusicRepo musicRepo;

  @Value("${upload.path}")
  private String uploadPath;

  public List<Music> getAllMusic() {
    return musicRepo.findAll();
  }

  public void addMusic(Music music, MultipartFile file, User user) throws IOException {
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
      musicRepo.save(music);
    }
  }

  private String renameFile(String originalName, String toName) {
    int index = originalName.lastIndexOf('.');
    String fileExtension = originalName.substring(index);
    return toName + fileExtension;
  }
}
