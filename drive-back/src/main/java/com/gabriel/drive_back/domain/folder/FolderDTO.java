package com.gabriel.drive_back.domain.folder;

import jakarta.validation.constraints.NotEmpty;

public record FolderDTO(@NotEmpty String name) {
}
