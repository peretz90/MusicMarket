package by.peretz90.musicmarket.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

  @Value("${upload.path}")
  private String uploadPath;

  @Bean
  public RestTemplate getRestTemplates() {
    return new RestTemplate();
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/music/**")
        .addResourceLocations("file://" + uploadPath + "/");
    registry.addResourceHandler("/static/**")
        .addResourceLocations("classpath:/static/");
  }

  @Override
  public void addViewControllers(ViewControllerRegistry registry) {
    registry.addViewController("/login")
        .setViewName("login");
    registry.addViewController("/")
        .setViewName("index");
    registry.addViewController("/users/registration")
        .setViewName("registration");
    registry.addViewController("/musics")
        .setViewName("musics");
    registry.addViewController("/musics/add")
        .setViewName("musicForm");
    registry.addViewController("/users")
        .setViewName("users");
  }
}
