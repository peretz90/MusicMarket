package by.peretz90.musicmarket.Domain;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "users_set")
@Data
public class Subscribers {

  @EmbeddedId
  UserKey id;

  @ManyToOne
  @MapsId("id")
  @JoinColumn(name = "user_id")
  User userId;

  @ManyToOne
  @MapsId("id")
  @JoinColumn(name = "sub_user_id")
  User userSub;

}
