package com.gabriel.drive_back.repository;

import com.gabriel.drive_back.domain.folder.Folder;
import com.gabriel.drive_back.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {
    Optional<List<Folder>> findByUserId(User userId);
}
