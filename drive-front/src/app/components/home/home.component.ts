import { Component, OnDestroy, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { FileClass } from '../file/File';
import { FolderService } from '../../services/folder.service';
import { FolderClass } from '../folder/Folder';
import { Subject, takeUntil } from 'rxjs';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {

  folders$: FolderClass[] = [];
  files$: FileClass[] = [];
  folderFiles$: FileClass[] = [];
  optionsModalDisplay = 'none';
  lookingAtFolder: boolean = false;
  folderDisplay: string = 'block'
  currentFolderId: string = ''
  unsubscribeSignal: Subject<void> = new Subject();

  constructor(private fileService: FileService,
    private folderService: FolderService,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.fileService.getAllFiles()
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe((res: FileClass[]) =>
        this.files$ = res)

    this.folderService.findAllFolders()
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe((res: FolderClass[]) =>
        this.folders$ = res)
  }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }

  getFolderEvent(event: boolean) {
    this.lookingAtFolder = event;
    this.folderDisplay = 'none';
  }

  setFolderId(event: string) {
    this.currentFolderId = event;
  }

  onFileUpload(event: any) {
    const file: File = event.target.files[0]
    const formData = new FormData();
    formData.append("file", file, file.name);

    this.fileService.saveFile(formData)
      .subscribe(() => {
        this.findAllFiles()
      });
  }

  onFolderUpload(event: any) {
    var folderName: string = '';
    var folderId: string;

    if (event.target.files.length > 0) {
      let files = event.target.files;
      //Pegando nome da pasta
      var folderUrl: string = files[0].webkitRelativePath as string;
      var removeAfter = folderUrl.indexOf('/')
      folderName = folderUrl.substring(0, removeAfter);

      this.folderService.saveFolder(folderName)
        .pipe(takeUntil(this.unsubscribeSignal))
        .subscribe((res: FolderClass) => {
          folderId = res.id;
          this.saveFilesWithFolderId(files, folderId)
        })
    }
  }

  saveFilesWithFolderId(files: any, folderId: string) {
    var folderSize: number = 0;

    for (var i = 0; i < files.length; ++i) {
      const file: File = files[i]
      const formData = new FormData();
      formData.append("file", file, file.name);
      this.saveFileAndInsertFolderId(formData, folderId)
      folderSize += file.size as number;
    }
    this.setFolderSize(folderId, folderSize);
  }

  saveFileAndInsertFolderId(formData: FormData, folderId: string) {
    this.fileService.saveFile(formData)
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe({
        next: (res) => {
          this.insertFolderIdInNewFile(res.body as FileClass, folderId)
        },
        error: (err) => console.log(err)
      })
  }

  setFolderSize(folderId: string, folderSize: number) {
    this.folderService.setFolderSize(folderId as unknown as number, folderSize)
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe(() => {
        this.findAllFolders()
      })
  }

  insertFolderIdInNewFile(fileSaved: FileClass, folderId: string) {
    this.fileService.saveFolderId(fileSaved.id as unknown as number, folderId as unknown as number)
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe()
  }

  findAllFiles() {
    this.fileService.getAllFiles()
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe({
        next: (res: FileClass[]) => {
          this.files$ = res
          this.formatFileSize()
        }
      })
  }

  findAllFolders() {
    this.folderService.findAllFolders()
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe((res: FolderClass[]) => {
        this.folders$ = res;
        this.formatFolderSize()
      });
  }

  filterByNameAscending() {
    if (this.currentFolderId != '') {
      this.folderService.findAllFilesByFolderId(this.currentFolderId)
        .pipe(takeUntil(this.unsubscribeSignal))
        .subscribe((res) => {
          this.folderFiles$ = res;
          this.folderFiles$.sort((a, b) => a.originalName.localeCompare(b.originalName))
          this.formatFolderFileSize()
        })
    } else if (this.currentFolderId == '') {
      this.files$.sort((a, b) => a.originalName.localeCompare(b.originalName))
      this.folders$.sort((a, b) => a.name.localeCompare(b.name))
    }

  }

  filterByNameDescending() {
    if (this.currentFolderId != '') {
      this.folderService.findAllFilesByFolderId(this.currentFolderId)
        .pipe(takeUntil(this.unsubscribeSignal))
        .subscribe((res) => {
          this.folderFiles$ = res;
          this.folderFiles$.sort((a, b) => b.originalName.localeCompare(a.originalName))
          this.formatFolderFileSize()
        })
    } else if (this.currentFolderId == '') {
      this.files$.sort((a, b) => b.originalName.localeCompare(a.originalName))
      this.folders$.sort((a, b) => b.name.localeCompare(a.name))
    }
  }

  filterByDateAscending() {
    if (this.currentFolderId != '') {
      this.folderService.findAllFilesByFolderId(this.currentFolderId)
        .pipe(takeUntil(this.unsubscribeSignal))
        .subscribe((res) => {
          this.folderFiles$ = res;
          this.folderFiles$.sort((a, b) => a.createdDate.localeCompare(b.createdDate))
          this.formatFolderFileSize()
        })
    } else if (this.currentFolderId == '') {
      this.folders$.sort((a, b) => a.createdTime.localeCompare(b.createdTime))
      this.files$.sort((a, b) => a.createdDate.localeCompare(b.createdDate))
    }
  }

  filterByDateDescending() {
    if (this.currentFolderId != '') {
      this.folderService.findAllFilesByFolderId(this.currentFolderId)
        .pipe(takeUntil(this.unsubscribeSignal))
        .subscribe((res) => {
          this.folderFiles$ = res;
          this.folderFiles$.sort((a, b) => b.createdDate.localeCompare(a.createdDate))
          this.formatFolderFileSize()
        })
    } else if (this.currentFolderId == '') {
      this.folders$.sort((a, b) => b.createdTime.localeCompare(a.createdTime))
      this.files$.sort((a, b) => b.createdDate.localeCompare(a.createdDate))
    }
  }

  filterBySizeAscending() {
    if (this.currentFolderId != '') {
      this.folderService.findAllFilesByFolderId(this.currentFolderId)
        .pipe(takeUntil(this.unsubscribeSignal))
        .subscribe((res) => {
          this.folderFiles$ = res;
          this.folderFiles$.sort((a, b) => +a.size - +b.size)
          this.formatFolderFileSize()
          console.log(this.folderFiles$)
        })
    } else if (this.currentFolderId == '') {
      this.folders$.sort((a, b) => a.size.localeCompare(b.size))
      this.files$.sort((a, b) => a.size.localeCompare(b.size))
    }
  }

  filterBySizeDescending() {
    if (this.currentFolderId != '') {
      this.folderService.findAllFilesByFolderId(this.currentFolderId)
        .pipe(takeUntil(this.unsubscribeSignal))
        .subscribe((res) => {
          this.folderFiles$ = res;
          this.folderFiles$.sort((a, b) => +b.size - +a.size)
          this.formatFolderFileSize()
        })
    } else if (this.currentFolderId == '') {
      this.folders$.sort((a, b) => b.size.localeCompare(a.size))
      this.files$.sort((a, b) => b.size.localeCompare(a.size))
    }
  }

  closeFolder() {
    this.lookingAtFolder = false;
    this.folderDisplay = 'block';
    this.currentFolderId = '';
  }

  openFileModal() {
    if (this.optionsModalDisplay == 'flex') {
      this.optionsModalDisplay = 'none'
    } else {
      this.optionsModalDisplay = 'flex'
    }

  }

  formatFolderFileSize() {
    this.folderFiles$.forEach(file => {
      file.size = this.sharedService.formatBytes(file.size as unknown as number)
    })
  }

  formatFileSize() {
    this.files$.forEach(file => {
      file.size = this.sharedService.formatBytes(file.size as unknown as number)
    })
  }

  formatFolderSize() {
    this.folders$.forEach(folder => {
      folder.size = this.sharedService.formatBytes(folder.size as unknown as number)
    })
  }

}

