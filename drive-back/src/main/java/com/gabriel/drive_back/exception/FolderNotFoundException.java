package com.gabriel.drive_back.exception;

public class FolderNotFoundException extends RuntimeException{
    public FolderNotFoundException(String message) {
        super(message);
    }
}
