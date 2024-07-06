import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FolderClass } from '../../domain/Folder';
import { FileClass } from '../../domain/File';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  private readonly API = 'http://localhost:8080/'

  constructor(private http: HttpClient) { }

  saveFolder(folderName: string, userId: string) {
    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/json; charset=utf-8')
    var json = JSON.stringify({ name: folderName })
    return this.http.post<FolderClass>(this.API + 'folder/create/' + userId, json, { headers: header })
  }

  findAllFolders(userId: string) {
    return this.http.get<FolderClass[]>(this.API + 'folder/findall/' + userId)
  }

  findAllFilesByFolderId(id: string) {
    return this.http.get<FileClass[]>(this.API + 'file/get/folderid/' + id)
  }

  setFolderSize(folderId: number, size: number) {
    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/json; charset=utf-8')
    var json = JSON.stringify({ folderId: folderId, size: size })
    return this.http.post(this.API + 'folder/save/foldersize', json, { headers: header })
  }

  deleteFolder(folderId: string) {
    return this.http.delete(this.API + 'folder/delete/' + folderId);
  }
}
