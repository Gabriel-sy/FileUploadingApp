package com.gabriel.drive_back.handler;

import com.gabriel.drive_back.exception.ExceptionDetails;
import com.gabriel.drive_back.exception.FileNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(FileNotFoundException.class)
    public ResponseEntity<ExceptionDetails> fileNotFoundExceptionHandler(FileNotFoundException exception){
        return new ResponseEntity<>(
                ExceptionDetails.builder()
                        .title("Arquivo não encontrado")
                        .status(HttpStatus.NOT_FOUND.value())
                        .details(exception.getMessage())
                        .time(LocalDateTime.now())
                        .build(), HttpStatus.NOT_FOUND
        );
    }
}
