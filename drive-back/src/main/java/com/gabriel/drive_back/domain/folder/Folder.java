package com.gabriel.drive_back.domain.folder;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.gabriel.drive_back.domain.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table
@NoArgsConstructor
@AllArgsConstructor
public class Folder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String createdTime;
    private int size;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private User userId;

    public Folder(String name) {
        this.name = name;
    }

    public Folder(String name, String createdTime) {
        this.name = name;
        this.createdTime = createdTime;
    }
}
