import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileClass } from '../../domain/File';
import { FolderClass } from '../../domain/Folder';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private readonly API = 'http://localhost:8080/'

  constructor(private http: HttpClient) { }

  getFileProperties(id: string) {
    return this.http.get<FileClass>(this.API + 'file/get/file/' + id)
  }

  getFileBytes(id: string) {
    return this.http.get(this.API + 'file/get/bytes/' + id, { 'responseType': 'arraybuffer' as 'json' })
  }

  getFileContent(id: string) {
    return this.http.get(this.API + 'file/get/bytes/' + id, { responseType: 'text' })
  }

  saveFile(formData: FormData, userId: string) {
    return this.http.post(this.API + 'file/upload/' + userId, formData, {
      observe: 'response'
    });
  }

  saveFolderFile(formData: FormData) {
    return this.http.post<FileClass>(this.API + 'file/upload', formData);
  }

  getAllFiles(userId: string) {
    return this.http.get<FileClass[]>(this.API + 'file/get/all/' + userId)
  }

  saveFolderId(id: number, folderId: number) {
    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/json; charset=utf-8')
    var json = JSON.stringify({ id: id, folderId: folderId })
    return this.http.post<FolderClass>(this.API + 'file/save/folderid', json, { headers: header })
  }

  deleteFile(id: string) {
    return this.http.delete(this.API + 'file/delete/' + id);
  }

  deleteFilesByFolderId(folderId: string) {
    return this.http.delete(this.API + 'file/delete/byfolderid/' + folderId);
  }
}
