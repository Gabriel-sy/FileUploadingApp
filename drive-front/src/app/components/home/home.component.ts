import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output } from '@angular/core';
import { FileService } from '../../services/file.service';
import { FileClass } from '../file/File';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  files$: FileClass[] = [];
  optionsModalDisplay = 'none';

  constructor(private fileService: FileService) {

  }

  ngOnInit(): void {
    this.fileService.getAllFiles().subscribe({
      next: (res: FileClass[]) => this.files$ = res,
      error: (err) => console.log(err)
    })

  }



  openFileModal() {
    if (this.optionsModalDisplay == 'flex') {
      this.optionsModalDisplay = 'none'
    } else {
      this.optionsModalDisplay = 'flex'
    }

  }

  onFileUpload(event: any) {
    const file: File = event.target.files[0]

    const formData = new FormData();
    formData.append("file", file, file.name);

    this.fileService.saveFile(formData)
      .subscribe((response) => {
        if (response.status === 200) {
          console.log('File uploaded');
        } else {
          console.log('File not uploaded');
        }
      }
      );
  }

  // getFileData() {
  //   var file: FileClass;
  //   this.fileService.getFileProperties(1).subscribe((res: FileClass) => {
  //     file = res;
  //     this.fileName = file.name;
  //     this.fileSize = file.size;
  //     this.fileCreatedDate = file.createdDate;
  //   })
  // }
}
