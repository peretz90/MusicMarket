package by.peretz90.musicmarket.Repository;

import by.peretz90.musicmarket.Domain.Subscribers;
import by.peretz90.musicmarket.Domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscribersRepo extends JpaRepository<Subscribers, Long> {
  Subscribers findByUserIdAndUserSub(User userId, User userSub);
}
