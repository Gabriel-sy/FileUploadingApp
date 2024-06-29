package com.gabriel.drive_back.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String originalName;
    private String name;
    private Long size;
    private String createdDate;
    private String type;
    @Lob
    private byte[] fileBytes;

    public File(String originalName, Long size, String type, byte[] fileBytes, String createdDate, String name) {
        this.name = name;
        this.createdDate = createdDate;
        this.originalName = originalName;
        this.size = size;
        this.type = type;
        this.fileBytes = fileBytes;
    }
}
