import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileService } from '../../services/file.service';
import { FileClass } from '../file/File';
import { FolderService } from '../../services/folder.service';
import { FolderClass } from './Folder';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.css'
})
export class FolderComponent {

  txtModalDisplay: string = 'none';
  modalDisplay: string = 'none'
  txtFileContent: string = '';
  txtFileTitle: string = '';
  @Input() folders$: FolderClass[] = [];
  @Output() lookingAtFolder = new EventEmitter<boolean>()
  @Output() currentFolderId = new EventEmitter<string>()

  constructor(private fileService: FileService, private folderService: FolderService) { }


  openFolder() {
    this.lookingAtFolder.emit(true)
  }

  setCurrentFolder(folderId: string){
    this.currentFolderId.emit(folderId)
  }

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
