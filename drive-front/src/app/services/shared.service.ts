import { Injectable } from '@angular/core';
import { FileService } from './file.service';
import { FileClass } from '../components/file/File';
import { Observable, Subscription, map } from 'rxjs';
import { FolderService } from './folder.service';
import { FolderClass } from '../components/folder/Folder';

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

  filterFolderFilesByNameAsc(folderFiles$: Observable<FileClass[]>){
    return folderFiles$.pipe(map((folderFiles) => {
      folderFiles.sort((a, b) => {
        return a.originalName.localeCompare(b.originalName);
      });
      return folderFiles;
    }))
  }

  filterFolderFilesByNameDesc(folderFiles$: Observable<FileClass[]>){
    return folderFiles$.pipe(map((folderFiles) => {
      folderFiles.sort((a, b) => {
        return b.originalName.localeCompare(a.originalName);
      });
      return folderFiles;
    }))
  }
  
  filterFolderFilesByDateAsc(folderFiles$: Observable<FileClass[]>){
    return folderFiles$.pipe(map((folderFiles) => {
      folderFiles.sort((a, b) => {
        return a.createdDate.localeCompare(b.createdDate);
      });
      return folderFiles;
    }))
  }

  filterFolderFilesByDateDesc(folderFiles$: Observable<FileClass[]>){
    return folderFiles$.pipe(map((folderFiles) => {
      folderFiles.sort((a, b) => {
        return b.createdDate.localeCompare(a.createdDate);
      });
      return folderFiles;
    }))
  }

  filterFilesByNameAsc(files$: Observable<FileClass[]>){
    return files$.pipe(map((files) => {
      files.sort((a, b) => {
        return a.originalName.localeCompare(b.originalName);
      });
      return files;
    }))
  }

  filterFilesByNameDesc(files$: Observable<FileClass[]>){
    return files$.pipe(map((files) => {
      files.sort((a, b) => {
        return b.originalName.localeCompare(a.originalName);
      });
      return files;
    }))
  }

  filterFilesByDateAsc(files$: Observable<FileClass[]>){
    return files$.pipe(map((files) => {
      files.sort((a, b) => {
        return a.createdDate.localeCompare(b.createdDate);
      });
      return files;
    }))
  }

  filterFilesByDateDesc(files$: Observable<FileClass[]>){
    return files$.pipe(map((files) => {
      files.sort((a, b) => {
        return b.createdDate.localeCompare(a.createdDate);
      });
      return files;
    }))
  }

  filterFoldersByNameDesc(folders$: Observable<FolderClass[]>){
    return folders$.pipe(map((folders) => {
      folders.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
      return folders;
    }))
  }

  filterFoldersByNameAsc(folders$: Observable<FolderClass[]>){
    return folders$.pipe(map((folders) => {
      folders.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      return folders;
    }))
  }

  filterFoldersByDateAsc(folders$: Observable<FolderClass[]>){
    return folders$.pipe(map((folders) => {
      folders.sort((a, b) => {
        return a.createdTime.localeCompare(b.createdTime);
      });
      return folders;
    }))
  }

  filterFoldersByDateDesc(folders$: Observable<FolderClass[]>){
    return folders$.pipe(map((folders) => {
      folders.sort((a, b) => {
        return b.createdTime.localeCompare(a.createdTime);
      });
      return folders;
    }))
  }

}
