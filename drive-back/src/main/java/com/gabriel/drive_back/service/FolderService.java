package com.gabriel.drive_back.service;

import com.gabriel.drive_back.domain.folder.Folder;
import com.gabriel.drive_back.domain.folder.FolderDTO;
import com.gabriel.drive_back.domain.folder.FolderSizeDTO;
import com.gabriel.drive_back.domain.user.User;
import com.gabriel.drive_back.exception.FolderNotFoundException;
import com.gabriel.drive_back.repository.FolderRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class FolderService {
    private final FolderRepository folderRepository;
    private final UserService userService;

    public FolderService(FolderRepository folderRepository, UserService userService) {
        this.folderRepository = folderRepository;
        this.userService = userService;
    }

    @Transactional
    public Folder saveNewFolder(FolderDTO folderDTO, String userId) {
        LocalDateTime timeCreated = LocalDateTime.now();
        String formattedTime = DateTimeFormatter.ofPattern("dd-MM-yyyy").format(timeCreated);

        User user = userService.findUserById(Long.valueOf(userId));

        Folder folder = new Folder(folderDTO.name(), formattedTime, user);
        return folderRepository.save(folder);
    }
    @Transactional
    public Folder findFolderById(Long id){
        return folderRepository.findById(id).orElseThrow(() -> new FolderNotFoundException("ID não encontrado"));
    }

    public void saveFolderSize(FolderSizeDTO folderSizeDTO) {
        Folder folder = findFolderById(folderSizeDTO.folderId());
        folder.setSize(folderSizeDTO.size());
        folderRepository.save(folder);
    }

    @Transactional
    public List<Folder> findFolderByUserId(String userId) {
        User user = userService.findUserById(Long.valueOf(userId));
        return folderRepository.findByUserId(user).orElseThrow(() -> new FolderNotFoundException("Nenhuma pasta corresponde a esse usuário"));
    }
}
