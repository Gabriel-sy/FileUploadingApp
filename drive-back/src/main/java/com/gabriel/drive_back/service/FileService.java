package com.gabriel.drive_back.service;

import com.gabriel.drive_back.domain.file.File;
import com.gabriel.drive_back.domain.file.FileDTO;
import com.gabriel.drive_back.domain.user.User;
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
    private final UserService userService;

    public FileService(FileRepository fileRepository, UserService userService) {
        this.fileRepository = fileRepository;
        this.userService = userService;
    }
    @Transactional
    public File findFileById(Long id){
        return fileRepository.findById(id).orElseThrow(() -> new FileNotFoundException("ID não encontrado"));
    }
    @Transactional
    public File saveFile(MultipartFile file, String userId) throws IOException {
        LocalDateTime timeCreated = LocalDateTime.now();
        String formattedCreatedTime = DateTimeFormatter.ofPattern("dd-MM-yyyy").format(timeCreated);

        User user = userService.findUserById(Long.valueOf(userId));

        File newFile = new File(file.getOriginalFilename(),
                file.getName(),
                file.getSize(),
                formattedCreatedTime,
                file.getContentType(),
                file.getBytes(), user);

        fileRepository.save(newFile);
        return newFile;
    }

    @Transactional
    public List<File> findFileByFolderId(Long id){
        return fileRepository.findByFolderId(id).orElseThrow(() -> new FileNotFoundException("Nenhum arquivo corresponde a essa pasta"));
    }
    public void saveFolderId(FileDTO fileDTO) {
        File fileFound = findFileById(fileDTO.id());
        fileFound.setFolderId(fileDTO.folderId());
        fileRepository.save(fileFound);
    }

    @Transactional
    public void deleteFileByFolderId(Long id){
        fileRepository.deleteByFolderId(id);
    }

    @Transactional
    public List<File> findAllByUserId(String userId) {
        User user = userService.findUserById(Long.valueOf(userId));
        return fileRepository.findByUserId(user).orElseThrow(() -> new FileNotFoundException("Esse usuário não possui nenhum arquivo"));
    }
}
