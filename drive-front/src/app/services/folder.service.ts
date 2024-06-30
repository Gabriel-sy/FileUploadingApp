import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FolderClass } from '../components/folder/Folder';
import { FileClass } from '../components/file/File';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  constructor(private http: HttpClient) { }

  saveFolder(folderName: string) {
    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/json; charset=utf-8')
    var json = JSON.stringify({ name: folderName })
    return this.http.post<FolderClass>('http://localhost:8080/folder/create', json, { headers: header })
  }

  findAllFolders(){
    return this.http.get<FolderClass[]>('http://localhost:8080/folder/findall')
  }

  findAllFilesByFolderId(id: string){
    return this.http.get<FileClass[]>('http://localhost:8080/api/get/folderid/' + id)
  }

  setFolderSize(folderId: number, size: number){
    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/json; charset=utf-8')
    var json = JSON.stringify({ folderId: folderId, size: size })
    return this.http.post('http://localhost:8080/folder/save/foldersize', json, { headers: header })
  }
}
