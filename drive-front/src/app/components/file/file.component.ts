import { Component, Input, OnInit } from '@angular/core';
import { FileClass } from './File';
import { FileService } from '../../services/file.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-file',
  templateUrl:'./file.component.html',
  styleUrl: './file.component.css'
})
export class FileComponent implements OnInit {


  txtModalDisplay: string = 'none';
  modalDisplay: string = 'none'
  txtFileContent: string = '';
  txtFileTitle: string = '';
  @Input() files$: FileClass[] = []

  constructor(private fileService: FileService, private sharedService: SharedService) { }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  ngOnInit(): void {
    for (let i = 0; i < this.files$.length; i++) {
      //Formatando o tamanho do arquivo.
      const size: string = this.sharedService.formatBytes(this.files$[i].size as unknown as number);
      this.files$[i].size = size;
    }
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

  closeTxtModal(){
    this.txtModalDisplay = 'none'
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
