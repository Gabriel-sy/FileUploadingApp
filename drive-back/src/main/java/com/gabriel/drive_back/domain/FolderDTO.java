package com.gabriel.drive_back.domain;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record FolderDTO(@NotEmpty String name) {
}
