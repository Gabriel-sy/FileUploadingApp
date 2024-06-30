import { Injectable } from '@angular/core';
import { FileService } from './file.service';
import { FileClass } from '../components/file/File';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private fileService: FileService) { }

  downloadFile(id: string, name: string){
    var newFile: FileClass;
    this.fileService.getFileProperties(id).subscribe((res: FileClass) => {
      newFile = res;
    })
    if (name.includes(".pdf")) {
      this.fileService.getFileBytes(id).subscribe((response) => {

        let file = new Blob([response as BlobPart], { type: 'application/pdf' });

        var fileURL = URL.createObjectURL(file);

        var a = document.createElement('a')

        a.href = fileURL;

        a.download = newFile.originalName;

        document.body.appendChild(a);
        a.click();
      }
      )
    } else {
      this.fileService.getFileBytes(id).subscribe((response) => {

        let file = new Blob([response as BlobPart], { type: 'text' });

        var fileURL = URL.createObjectURL(file);

        var a = document.createElement('a')

        a.href = fileURL;

        a.download = name;

        document.body.appendChild(a);
        a.click();
      })
    }
  }

  formatBytes(a: number, b = 2) {
    if (!+a) return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024)); 
    return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]}`
  }
}
