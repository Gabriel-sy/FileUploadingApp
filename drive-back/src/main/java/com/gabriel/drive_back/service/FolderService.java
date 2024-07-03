package com.gabriel.drive_back.service;

import com.gabriel.drive_back.domain.folder.Folder;
import com.gabriel.drive_back.domain.folder.FolderDTO;
import com.gabriel.drive_back.domain.folder.FolderSizeDTO;
import com.gabriel.drive_back.exception.FolderNotFoundException;
import com.gabriel.drive_back.repository.FolderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class FolderService {
    private final FolderRepository folderRepository;

    public FolderService(FolderRepository folderRepository) {
        this.folderRepository = folderRepository;
    }


    public Folder saveNewFolder(FolderDTO folderDTO) {
        LocalDateTime timeCreated = LocalDateTime.now();
        String formattedTime = DateTimeFormatter.ofPattern("dd-MM-yyyy").format(timeCreated);
        Folder folder = new Folder(folderDTO.name(), formattedTime);
        return folderRepository.save(folder);
    }

    public Folder findFolderById(Long id){
        return folderRepository.findById(id).orElseThrow(() -> new FolderNotFoundException("ID não encontrado"));
    }

    public void saveFolderSize(FolderSizeDTO folderSizeDTO) {
        Folder folder = findFolderById(folderSizeDTO.folderId());
        folder.setSize(folderSizeDTO.size());
        folderRepository.save(folder);
    }
}
