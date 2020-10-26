package by.peretz90.musicmarket.domain;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@EqualsAndHashCode(callSuper = true, of = { "id" })
@Entity
@Table
@Data
@NoArgsConstructor
public class Music extends AbstractEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  private String name;

  private String url;

  private BigDecimal price;


  @ManyToOne(fetch = FetchType.EAGER)
  @JsonIdentityReference
  private User userAuthor;

  @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
  @JoinTable(
      name = "buying_music",
      joinColumns = @JoinColumn(name = "music_id"),
      inverseJoinColumns = @JoinColumn(name = "user_id")
  )
  @JsonIdentityReference
  @JsonIdentityInfo(
      property = "id",
      generator = ObjectIdGenerators.PropertyGenerator.class
  )
  private Set<User> buyers = new HashSet<>();

}
