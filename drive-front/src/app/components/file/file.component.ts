import { Component, Input } from '@angular/core';
import { FileClass } from './File';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrl: './file.component.css'
})
export class FileComponent {

  modalDisplay: string = 'none'
  @Input() files$: FileClass[] = []
  txtModalDisplay: string = 'none';
  txtFileContent: string = '';
  txtFileTitle: string = '';

  constructor(private fileService: FileService) { }

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

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  getFileBytes(id: string, name: string) {

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
}
