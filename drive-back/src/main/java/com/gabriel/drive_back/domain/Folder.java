package com.gabriel.drive_back.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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

    public Folder(String name) {
        this.name = name;
    }

    public Folder(String name, String createdTime) {
        this.name = name;
        this.createdTime = createdTime;
    }
}
