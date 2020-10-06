package by.peretz90.musicmarket.Service;

import by.peretz90.musicmarket.Domain.User;
import by.peretz90.musicmarket.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

  public final UserRepo userRepo;

  public List<User> users() {
    return userRepo.findAll();
  }

  public User addUser(User user) {
    return userRepo.save(user);
  }

}
