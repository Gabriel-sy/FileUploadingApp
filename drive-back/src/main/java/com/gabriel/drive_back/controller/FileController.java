package com.gabriel.drive_back.controller;

import com.gabriel.drive_back.domain.File;
import com.gabriel.drive_back.domain.FileDTO;
import com.gabriel.drive_back.repository.FileRepository;
import com.gabriel.drive_back.service.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/file")
public class FileController {
    private final FileRepository fileRepository;
    private final FileService fileService;

    public FileController(FileRepository fileRepository, FileService fileService) {
        this.fileRepository = fileRepository;
        this.fileService = fileService;
    }

    @PostMapping(path = "/upload")
    public ResponseEntity<File> saveFileApi(@RequestParam("file") MultipartFile file) throws IOException {
        File newFile = fileService.saveFile(file);

        return ResponseEntity.ok(newFile);
    }

    @PostMapping(path = "/save/folderid")
    public ResponseEntity<Void> saveFolderId(@RequestBody FileDTO fileDTO){
        fileService.saveFolderId(fileDTO);

        return ResponseEntity.ok().build();
    }


    @GetMapping(path = "/get/bytes/{id}")
    public ResponseEntity<byte[]> getBytes(@PathVariable Long id){
        File file = fileService.findFileById(id);

        return ResponseEntity.ok(file.getFileBytes());
    }

    @GetMapping(path = "/get/file/{id}")
    public ResponseEntity<File> getFile(@PathVariable Long id) {
        File file = fileService.findFileById(id);

        return ResponseEntity.ok(file);
    }

    @GetMapping(path = "/get/all")
    public ResponseEntity<List<File>> findAllFiles(){
        return ResponseEntity.ok(fileRepository.findAll());
    }

    @GetMapping(path = "/get/folderid/{id}")
    public List<File> findAllByFolderId(@PathVariable Long id){
        return fileService.findFileByFolderId(id);
    }

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long id){
        fileRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping(path = "/delete/byfolderid/{id}")
    public ResponseEntity<Void> deleteFileByFolderId(@PathVariable Long id){
        fileService.deleteFileByFolderId(id);
        return ResponseEntity.ok().build();
    }

}
