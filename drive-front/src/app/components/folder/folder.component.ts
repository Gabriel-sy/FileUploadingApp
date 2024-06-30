import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileService } from '../../services/file.service';
import { FileClass } from '../file/File';
import { FolderService } from '../../services/folder.service';
import { FolderClass } from './Folder';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.css'
})
export class FolderComponent implements OnInit {

  txtModalDisplay: string = 'none';
  modalDisplay: string = 'none'
  txtFileContent: string = '';
  txtFileTitle: string = '';
  @Input() folders$: FolderClass[] = [];
  @Output() lookingAtFolder = new EventEmitter<boolean>()
  @Output() currentFolderId = new EventEmitter<string>()

  constructor(private fileService: FileService, private folderService: FolderService, private sharedService: SharedService) { }

  

  ngOnInit(): void {
    for (let i = 0; i < this.folders$.length; i++) {
      //Formatando o tamanho da pasta.
      const size: string = this.sharedService.formatBytes(this.folders$[i].size as unknown as number);
      this.folders$[i].size = size;
    }
  }

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
    this.sharedService.downloadFile(id, name);
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
