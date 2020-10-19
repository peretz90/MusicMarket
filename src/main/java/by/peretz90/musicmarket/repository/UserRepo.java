package by.peretz90.musicmarket.repository;

import by.peretz90.musicmarket.domain.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
  User findByUsername(String username);
  User findByActivationCode(String code);

  @EntityGraph(attributePaths = { "subscriptions", "subscribers" })
  Optional<User> findById(Long aLong);
}
