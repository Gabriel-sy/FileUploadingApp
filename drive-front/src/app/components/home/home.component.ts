import { Component, OnInit, Output } from '@angular/core';
import { FileService } from '../../services/file.service';
import { FileClass } from '../file/File';
import { FolderService } from '../../services/folder.service';
import { FolderClass } from '../folder/Folder';
import { Observable } from 'rxjs';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  folders$: FolderClass[] = [];
  files$: FileClass[] = [];
  optionsModalDisplay = 'none';
  lookingAtFolder: boolean = false;
  folderDisplay: string = 'block'
  currentFolderId: string = ''

  constructor(private fileService: FileService, private folderService: FolderService, private sharedService: SharedService) {

  }

  closeFolder() {
    this.lookingAtFolder = false;
    this.folderDisplay = 'block';
  }

  getFolderEvent(event: boolean) {
    this.lookingAtFolder = event;
    this.folderDisplay = 'none';
  }

  setFolderId(event: string) {
    this.currentFolderId = event;
  }

  ngOnInit(): void {
    this.findAllFiles()
    this.findAllFolders()
  }

  findAllFiles() {
    this.fileService.getAllFiles().subscribe({
      next: (res: FileClass[]) => {
        this.files$ = res
      },
      error: (err) => console.log(err)
    })
  }

  findAllFolders() {
    this.folderService.findAllFolders().subscribe((res: FolderClass[]) => {
      this.folders$ = res;
    });
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
          this.findAllFiles()
        } else {
          console.log('File not uploaded');
        }
      }
      );
  }


  onFolderUpload(event: any) {
    var folderName: string = '';
    var folderId: string;

    if (event.target.files.length > 0) {
      let files = event.target.files;
      var folderUrl: string = files[0].webkitRelativePath as string;
      var removeAfter = folderUrl.indexOf('/')
      folderName = folderUrl.substring(0, removeAfter);

      this.folderService.saveFolder(folderName).subscribe((res: FolderClass) => {
        this.findAllFolders()
        folderId = res.id;
        this.saveFileAndInsertFolderId(files, folderId)
      })



      // if (!(files[i].webkitRelativePath.split('/').length > 2)) {
      //   Pegando nome da pasta

      // }
    }

  }

  insertFolderIdInNewFile(fileSaved: FileClass, folderId: string) {
    this.fileService.saveFolderId(fileSaved.id as unknown as number, folderId as unknown as number)
      .subscribe((res) => {
        console.log(res)
      })
  }

  saveFileAndInsertFolderId(files: any, folderId: string) {
    var folderSize: number = 0;
    for (var i = 0; i < files.length; ++i) {
      const file: File = files[i]
      folderSize += file.size as number;
      const formData = new FormData();
      formData.append("file", file, file.name);

      this.fileService.saveFile(formData).subscribe({
        next: (res) => this.insertFolderIdInNewFile(res.body as FileClass, folderId),
        error: (err) => console.log(err)
      })
    }
    this.folderService.setFolderSize(folderId as unknown as number, folderSize).subscribe()
  }

  

}

