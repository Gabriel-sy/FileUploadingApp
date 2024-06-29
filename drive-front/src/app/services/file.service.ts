import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileClass } from '../components/file/File';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  getFileProperties(id: string) {
    return this.http.get<FileClass>('http://localhost:8080/api/get/file/' + id)
  }

  getFileBytes(id: string) {
    return this.http.get('http://localhost:8080/api/get/bytes/' + id, { 'responseType': 'arraybuffer' as 'json' })
  }

  getFileContent(id: string) {
    return this.http.get('http://localhost:8080/api/get/bytes/' + id, { responseType: 'text' })
  }

  saveFile(formData: FormData) {
    return this.http.post('http://localhost:8080/api/upload', formData, { observe: 'response' });
  }

  getAllFiles() {
    return this.http.get<FileClass[]>('http://localhost:8080/api/get/all')
  }
}
