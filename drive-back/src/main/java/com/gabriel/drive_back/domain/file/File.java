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
    private String originalName;
    private String name;
    private Long size;
    private String createdDate;
    private String type;
    @Lob
    private byte[] fileBytes;
    private Long folderId;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private User userId;

    public File(String originalName, Long size, String type, byte[] fileBytes, String createdDate, String name) {
        this.name = name;
        this.createdDate = createdDate;
        this.originalName = originalName;
        this.size = size;
        this.type = type;
        this.fileBytes = fileBytes;

    }
}
