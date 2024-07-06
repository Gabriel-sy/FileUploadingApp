import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileClass } from '../../domain/File';
import { FolderClass } from '../../domain/Folder';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  getFileProperties(id: string) {
    return this.http.get<FileClass>('http://localhost:8080/file/get/file/' + id)
  }

  getFileBytes(id: string) {
    return this.http.get('http://localhost:8080/file/get/bytes/' + id, { 'responseType': 'arraybuffer' as 'json' })
  }

  getFileContent(id: string) {
    return this.http.get('http://localhost:8080/file/get/bytes/' + id, { responseType: 'text' })
  }

  saveFile(formData: FormData, userId: string) {
    return this.http.post('http://localhost:8080/file/upload/' + userId, formData, {
      observe: 'response'
    });
  }

  saveFolderFile(formData: FormData) {
    return this.http.post<FileClass>('http://localhost:8080/file/upload', formData);
  }

  getAllFiles(userId: string) {
    return this.http.get<FileClass[]>('http://localhost:8080/file/get/all/' + userId)
  }

  saveFolderId(id: number, folderId: number) {
    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/json; charset=utf-8')
    var json = JSON.stringify({ id: id, folderId: folderId })
    return this.http.post<FolderClass>('http://localhost:8080/file/save/folderid', json, { headers: header })
  }

  deleteFile(id: string) {
    return this.http.delete('http://localhost:8080/file/delete/' + id);
  }

  deleteFilesByFolderId(folderId: string) {
    return this.http.delete('http://localhost:8080/file/delete/byfolderid/' + folderId);
  }
}
