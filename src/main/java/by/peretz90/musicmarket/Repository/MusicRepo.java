package by.peretz90.musicmarket.Repository;

import by.peretz90.musicmarket.Domain.Music;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MusicRepo extends JpaRepository<Music, Long> {
}
