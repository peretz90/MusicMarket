package by.peretz90.musicmarket.Domain;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "users_set")
@Data
public class Subscribers {

  @Id
  private Long id;

  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, targetEntity = User.class)
  @JoinColumn(name = "user_id")
  private User userId;

  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, targetEntity = User.class)
  @JoinColumn(name = "sub_user_id")
  private User userSub;

}
