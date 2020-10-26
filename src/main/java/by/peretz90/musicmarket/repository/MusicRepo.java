package by.peretz90.musicmarket.repository;

import by.peretz90.musicmarket.domain.Music;
import by.peretz90.musicmarket.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MusicRepo extends JpaRepository<Music, Long> {
  List<Music> findByUserAuthor(User user);
}
