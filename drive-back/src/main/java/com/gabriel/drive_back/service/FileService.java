package com.gabriel.drive_back.service;

import com.gabriel.drive_back.domain.File;
import com.gabriel.drive_back.exception.FileNotFoundException;
import com.gabriel.drive_back.repository.FileRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class FileService {
    private final FileRepository fileRepository;

    public FileService(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    public File findFileById(Long id){
        return fileRepository.findById(id).orElseThrow(() -> new FileNotFoundException("ID não encontrado"));
    }

    public File saveFile(MultipartFile file) throws IOException {
        LocalDateTime timeCreated = LocalDateTime.now();

        String formattedCreatedTime = DateTimeFormatter.ofPattern("dd-MM-yyyy").format(timeCreated);

        File newFile = new File(file.getOriginalFilename(),
                file.getSize(),
                file.getContentType(),
                file.getBytes(),
                formattedCreatedTime,
                file.getName());

        fileRepository.save(newFile);
        return newFile;
    }

    @Transactional
    public List<File> findFileByFolderId(Long id){
        return fileRepository.findByFolderId(id).orElseThrow(IllegalArgumentException::new);
    }

}
