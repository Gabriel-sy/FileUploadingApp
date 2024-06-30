import { Component, Input, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { FileClass } from '../file/File';
import { FolderService } from '../../services/folder.service';
import { SharedService } from '../../services/shared.service';

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
    this.folderService.findAllFilesByFolderId(this.currentFolderId)
      .subscribe((res: FileClass[]) => {
        this.files$ = res;
        for (let i = 0; i < this.files$.length; i++) {
          //Formatando o tamanho do arquivo.
          const size: string = this.sharedService.formatBytes(this.files$[i].size as unknown as number);
          this.files$[i].size = size;
        }
      })
  }

  constructor(private folderService: FolderService, private fileService: FileService, private sharedService: SharedService) { }

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
