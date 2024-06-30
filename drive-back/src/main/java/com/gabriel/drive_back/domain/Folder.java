package com.gabriel.drive_back.domain;

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

    public Folder(String name) {
        this.name = name;
    }

}
