import { Injectable } from '@angular/core';
import { FileService } from './file.service';
import { FileClass } from '../components/file/File';
import { Subscription } from 'rxjs';
import { FolderService } from './folder.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private fileService: FileService, private folderService: FolderService) { }

  downloadFile(id: string, name: string) {
    var fileToDownload: FileClass;
    const getFileToDownloadData: Subscription = this.fileService.getFileProperties(id)
      .subscribe({
        next: (res: FileClass) => {
          fileToDownload = res;
        },
        complete: () => getFileToDownloadData.unsubscribe()
      })

    if (name.includes(".pdf")) {
      const downloadPdf: Subscription = this.fileService.getFileBytes(id)
        .subscribe({
          next: (res) => {
            let file = new Blob([res as BlobPart], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            var a = document.createElement('a');

            a.href = fileURL;
            a.download = fileToDownload.originalName;

            document.body.appendChild(a);
            a.click();
          },
          complete: () => downloadPdf.unsubscribe()
        });

    } else if (name.includes(".txt")) {
      const downloadTxt: Subscription = this.fileService.getFileBytes(id)
        .subscribe({
          next: (res) => {
            let file = new Blob([res as BlobPart], { type: 'text' });
            var fileURL = URL.createObjectURL(file);
            var a = document.createElement('a')

            a.href = fileURL;
            a.download = name;

            document.body.appendChild(a);
            a.click();
          },
          complete: () => downloadTxt.unsubscribe()
        })
    }
  }

  formatBytes(a: number, b = 2) {
    if (!+a) return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024));
    return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]}`
  }

  openPdf(id: string) {
    const open: Subscription = this.fileService.getFileBytes(id)
      .subscribe(
        {
          next: (res) => {
            let file = new Blob([res as BlobPart], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL)
          },
          complete: () => open.unsubscribe()
        }
      )
  }

}
