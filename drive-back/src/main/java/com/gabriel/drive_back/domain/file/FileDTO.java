package com.gabriel.drive_back.domain.file;

import jakarta.validation.constraints.NotEmpty;

public record FileDTO(@NotEmpty Long id, @NotEmpty Long folderId) {
}
