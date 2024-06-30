package com.gabriel.drive_back.controller;

import com.gabriel.drive_back.domain.File;
import com.gabriel.drive_back.domain.Folder;
import com.gabriel.drive_back.domain.FolderDTO;
import com.gabriel.drive_back.repository.FileRepository;
import com.gabriel.drive_back.repository.FolderRepository;
import com.gabriel.drive_back.service.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        Folder folder = new Folder(folderDTO.name());

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

}
