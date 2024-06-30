package com.gabriel.drive_back.controller;

import com.gabriel.drive_back.domain.File;
import com.gabriel.drive_back.domain.Folder;
import com.gabriel.drive_back.domain.FolderDTO;
import com.gabriel.drive_back.domain.FolderSizeDTO;
import com.gabriel.drive_back.repository.FileRepository;
import com.gabriel.drive_back.repository.FolderRepository;
import com.gabriel.drive_back.service.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/folder")
public class FolderController {
    private final FolderRepository folderRepository;
    private final FileService fileService;
    private final FileRepository fileRepository;

    public FolderController(FolderRepository folderRepository, FileService fileService, FileRepository fileRepository) {
        this.folderRepository = folderRepository;
        this.fileService = fileService;
        this.fileRepository = fileRepository;
    }

    @PostMapping(path = "/create")
    public ResponseEntity<Folder> saveFolder(@RequestBody FolderDTO folderDTO){

        LocalDateTime timeCreated = LocalDateTime.now();
        String formattedTime = DateTimeFormatter.ofPattern("dd-MM-yyyy").format(timeCreated);
        Folder folder = new Folder(folderDTO.name(), formattedTime);
        Folder savedFolder = folderRepository.save(folder);

        return ResponseEntity.ok(savedFolder);
    }

    @GetMapping(path = "/findall")
    public ResponseEntity<List<Folder>> findAllFolders(){
        return ResponseEntity.ok(folderRepository.findAll());
    }

    @GetMapping(path = "/find/{id}")
    public ResponseEntity<Folder> findFolderById(@PathVariable Long id){
        return ResponseEntity.ok(folderRepository.findById(id).orElseThrow(IllegalArgumentException::new));
    }

    @PostMapping(path = "/save/foldersize")
    public ResponseEntity<Void> saveFolderSize(@RequestBody FolderSizeDTO folderSizeDTO){
        Folder folder = folderRepository.findById(folderSizeDTO.folderId()).orElseThrow(IllegalArgumentException::new);
        folder.setSize(folderSizeDTO.size());
        folderRepository.save(folder);
        return ResponseEntity.ok().build();
    }

}
