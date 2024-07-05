package com.gabriel.drive_back.domain.file;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.gabriel.drive_back.domain.user.User;
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
    @Column(nullable = false, length = 100)
    private String originalName;
    @Column(nullable = false, length = 100)
    private String name;
    private Long size;
    @Column(nullable = false, length = 100)
    private String createdDate;
    @Column(nullable = false, length = 100)
    private String type;
    @Lob
    private byte[] fileBytes;
    private Long folderId;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id")
    private User userId;

    public File(String originalName, String name, Long size, String createdDate, String type, byte[] fileBytes, User userId) {
        this.originalName = originalName;
        this.name = name;
        this.size = size;
        this.createdDate = createdDate;
        this.type = type;
        this.fileBytes = fileBytes;
        this.userId = userId;
    }
}
