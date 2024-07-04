package com.gabriel.drive_back.controller;

import com.gabriel.drive_back.domain.folder.Folder;
import com.gabriel.drive_back.domain.folder.FolderDTO;
import com.gabriel.drive_back.domain.folder.FolderSizeDTO;
import com.gabriel.drive_back.repository.FolderRepository;
import com.gabriel.drive_back.service.FolderService;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/folder")
public class FolderController {
    private final FolderRepository folderRepository;
    private final FolderService folderService;

    public FolderController(FolderRepository folderRepository, FolderService folderService) {
        this.folderRepository = folderRepository;
        this.folderService = folderService;
    }

    @PostMapping(path = "/create/{userId}")
    public ResponseEntity<Folder> saveFolder(@RequestBody FolderDTO folderDTO, @PathVariable String userId){
        Folder savedFolder = folderService.saveNewFolder(folderDTO, userId);

        return ResponseEntity.ok(savedFolder);
    }

    @GetMapping(path = "/findall/{userId}")
    public ResponseEntity<List<Folder>> findAllFolders(@PathVariable String userId){
        return ResponseEntity.ok(folderService.findFolderByUserId(userId));
    }

    @GetMapping(path = "/find/{id}")
    public ResponseEntity<Folder> findFolderById(@PathVariable Long id){
        return ResponseEntity.ok(folderService.findFolderById(id));
    }

    @PostMapping(path = "/save/foldersize")
    public ResponseEntity<Void> saveFolderSize(@RequestBody FolderSizeDTO folderSizeDTO){
        folderService.saveFolderSize(folderSizeDTO);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping(path = "delete/{id}")
    public ResponseEntity<Void> deleteFolder(@PathVariable Long id){
        folderRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
