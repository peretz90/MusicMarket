package by.peretz90.musicmarket.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.thymeleaf.extras.java8time.dialect.Java8TimeDialect;

@Configuration
public class BeansConfig {

  @Bean
  PasswordEncoder getPasswordEncoder() {
    return new BCryptPasswordEncoder(8);
  }

  @Bean
  public Java8TimeDialect java8TimeDialect() {
    return new Java8TimeDialect();
  }
}
