import { Component, Input, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { FileClass } from '../file/File';
import { FolderService } from '../../services/folder.service';

@Component({
  selector: 'app-folder-files',
  templateUrl: './folder-files.component.html',
  styleUrl: './folder-files.component.css'
})
export class FolderFilesComponent implements OnInit {

  files$: FileClass[] = [];
  txtModalDisplay: string = 'none';
  modalDisplay: string = 'none'
  txtFileContent: string = '';
  txtFileTitle: string = '';
  @Input() currentFolderId: string = '';

  ngOnInit(): void {
    this.folderService.findAllFoldersByFolderId(this.currentFolderId)
      .subscribe((res: FileClass[]) => {
        this.files$ = res;
      })
  }

  constructor(private folderService: FolderService, private fileService: FileService) { }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  openFile(id: string, name: string) {

    if (name.includes(".pdf")) {

      this.fileService.getFileBytes(id).subscribe((response) => {

        let file = new Blob([response as BlobPart], { type: 'application/pdf' });

        var fileURL = URL.createObjectURL(file);
        window.open(fileURL)
      })
    } else {
      this.txtModalDisplay = 'flex'
      var newFile: FileClass;
      this.fileService.getFileContent(id).subscribe((res: string) => {
        this.txtFileContent = res;
        this.txtFileTitle = name.replace(".txt", "");
      })
    }
  }

  downloadFile(id: string, name: string) {
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


  closeTxtModal() {
    this.txtModalDisplay = 'none';
  }

  openModal(file: FileClass) {
    if (file.isModalOpen) {
      file.isModalOpen = false;
    } else {
      file.isModalOpen = true;
    }
  }

  closeModal() {
    this.txtModalDisplay = 'none'
  }
}
