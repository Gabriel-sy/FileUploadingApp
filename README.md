# FileUploadingApp
![Demo image](demoImage.png)

FileUploadingApp is an application that allows uploading and managing files and folders.

## Technologies Used

- Java
- Typescript
- Spring Boot
- Angular
- JWT
- PostgreSQL
- Docker

## Features

- **File/Folder Upload:** Each user can upload files and folders;
- **File Management:** It's possible to download, open, and browse the stored files;
- **File/Folder Filtering:** It's also possible to filter stored files/folders by name, date, and size;
- **Authentication:** JWT authentication system.

## Requirements

- JDK 17
- Node.js
- Angular
- PostgreSQL
- Docker

## Installation

1.  Clone the repository:
    ```bash
    git clone [https://github.com/Gabriel-sy/FileUploadingApp.git](https://www.google.com/search?q=https://github.com/Gabriel-sy/FileUploadingApp.git)
    ```
    *(Note: Assuming the correct URL is `.../FileUploadingApp.git` based on the original)*

2.  Configure the environment variables in `.env` (inside the `drive-back` directory):
    ```properties
    POSTGRES_USER=your_username
    POSTGRES_PASSWORD=your_password
    ```

3.  Start Spring with Docker:
    ```bash
    cd FileUploadingApp
    cd drive-back
    docker-compose up
    ```
4.  Install Angular dependencies and start the frontend:
    ```bash
    cd ..
    cd drive-front
    npm install
    npm run start
    ```

## Usage

- Access `localhost:4200/register` to register;
- Access `localhost:4200/login` to log in after registration;
- Access `localhost:4200/home` after logging in.
