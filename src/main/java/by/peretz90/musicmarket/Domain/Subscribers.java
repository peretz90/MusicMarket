package by.peretz90.musicmarket.Domain;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "users_set")
@Data
public class Subscribers {

  @Id
  Long id;

  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinColumn(name = "user_id")
  User userId;

  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinColumn(name = "sub_user_id")
  User userSub;

}
