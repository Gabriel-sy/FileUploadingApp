package com.gabriel.drive_back.repository;

import com.gabriel.drive_back.domain.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {
    Optional<List<File>> findByFolderId(Long folderId);
}
