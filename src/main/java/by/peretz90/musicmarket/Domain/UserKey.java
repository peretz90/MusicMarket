package by.peretz90.musicmarket.Domain;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@Data
public class UserKey implements Serializable {

  @Column(name = "user_id")
  Long userId;

  @Column(name = "sub_user_id")
  Long userIdSub;

}
