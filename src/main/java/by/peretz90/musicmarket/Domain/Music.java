package by.peretz90.musicmarket.Domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@EqualsAndHashCode(callSuper = true)
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

  @ManyToOne(fetch = FetchType.EAGER)
  @NonNull
  private User userAuthor;

}
