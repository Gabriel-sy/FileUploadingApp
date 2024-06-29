package com.gabriel.drive_back.controller;

import com.gabriel.drive_back.domain.File;
import com.gabriel.drive_back.repository.FileRepository;
import com.gabriel.drive_back.service.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api")
public class FileController {
    private final FileRepository fileRepository;
    private final FileService fileService;

    public FileController(FileRepository fileRepository, FileService fileService) {
        this.fileRepository = fileRepository;
        this.fileService = fileService;
    }

    @PostMapping(path = "/upload")
    public ResponseEntity<Void> saveFileApi(@RequestParam("file") MultipartFile file) throws IOException {

        LocalDateTime timeNow = LocalDateTime.now();

        String formattedTime = DateTimeFormatter.ofPattern("yyyy-MM-dd").format(timeNow);

        File newFile = new File(file.getOriginalFilename(),
                file.getSize(),
                file.getContentType(),
                file.getBytes(),
                formattedTime,
                file.getName());
        fileRepository.save(newFile);
        return ResponseEntity.ok().build();
    }

    @GetMapping(path = "/get/bytes/{id}")
    public ResponseEntity<byte[]> getBytes(@PathVariable Long id){
        File file = fileRepository.findById(id).orElseThrow(IllegalArgumentException::new);
        return ResponseEntity.ok(file.getFileBytes());
    }

    @GetMapping(path = "/get/file/{id}")
    public ResponseEntity<File> getFile(@PathVariable Long id) {
        File file = fileRepository.findById(id).orElseThrow(IllegalArgumentException::new);
        return ResponseEntity.ok(file);
    }

    @GetMapping(path = "/get/all")
    public ResponseEntity<List<File>> findAllFiles(){
        return ResponseEntity.ok(fileRepository.findAll());
    }
}
