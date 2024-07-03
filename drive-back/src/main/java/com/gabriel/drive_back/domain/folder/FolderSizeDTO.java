package com.gabriel.drive_back.domain.folder;

import jakarta.validation.constraints.NotEmpty;

public record FolderSizeDTO(@NotEmpty Long folderId, @NotEmpty int size) {
}
