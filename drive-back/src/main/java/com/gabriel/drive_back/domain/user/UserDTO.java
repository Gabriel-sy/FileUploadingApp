package com.gabriel.drive_back.domain.user;

import jakarta.validation.constraints.NotEmpty;

public record UserDTO(@NotEmpty String login, @NotEmpty String password) {
}
