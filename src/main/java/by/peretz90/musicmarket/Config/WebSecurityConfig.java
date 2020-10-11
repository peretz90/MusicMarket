package by.peretz90.musicmarket.Config;

import by.peretz90.musicmarket.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

  public final UserService userService;

  private final PasswordEncoder passwordEncoder;

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
        .authorizeRequests()
          .antMatchers("/", "/registration", "/static/**", "/user", "/success", "/activate/**").permitAll()
          .anyRequest().authenticated()
          .and()
        .formLogin()
          .defaultSuccessUrl("/")
          .loginPage("/login")
          .permitAll()
          .and()
        .oauth2Login()
          .defaultSuccessUrl("/success/oauth2", true)
          .loginPage("/login")
          .and()
        .logout()
          .logoutSuccessUrl("/")
          .permitAll()
        .and().csrf().disable();
  }

  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.userDetailsService(userService)
        .passwordEncoder(passwordEncoder);
  }
}
