import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FileService } from '../../services/file.service';
import { FileClass } from '../file/File';
import { FolderService } from '../../services/folder.service';
import { FolderClass } from '../folder/Folder';
import { Observable, Subject, map, takeUntil, throwError } from 'rxjs';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {

  folders$: Observable<FolderClass[]> = new Observable<FolderClass[]>();
  files$: Observable<FileClass[]> = new Observable<FileClass[]>();
  folderFiles$: Observable<FileClass[]> = new Observable<FileClass[]>();
  unsubscribeSignal: Subject<void> = new Subject();
  lookingAtFolder: boolean = false;
  currentFolderId: string = ''
  optionsModalDisplay = 'none';
  addButtonDisplay = 'flex';
  folderDisplay: string = 'block'
  userLogin: string = '';
  userId: string = '';
  private readonly platformId = inject(PLATFORM_ID)

  constructor(private fileService: FileService,
    private folderService: FolderService,
    private sharedService: SharedService,
    private authService: AuthService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      var jwt = localStorage.getItem("jwt");
      if (jwt) {
        this.authService.findUserByToken(jwt).subscribe({
          next: (res) => {
            this.userId = res.id;
            this.userLogin = res.login;
          },
          complete: () => {
            this.findAllFiles()
            this.findAllFolders()
          }
        });
      } else {
        this.authService.findUserByToken("")
          .pipe(takeUntil(this.unsubscribeSignal))
          .subscribe()
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }

  getFolderEvent(event: boolean) {
    this.lookingAtFolder = event;
    this.folderDisplay = 'none';
    this.addButtonDisplay = 'none';
  }

  setFolderId(event: string) {
    this.currentFolderId = event;
  }

  onFileUpload(event: any) {
    const file: File = event.target.files[0]
    const formData = new FormData();
    formData.append("file", file, file.name);

    this.fileService.saveFile(formData, this.userId)
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe({
        complete: () => { this.findAllFiles(); }
      })
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

      this.folderService.saveFolder(folderName, this.userId)
        .pipe(takeUntil(this.unsubscribeSignal))
        .subscribe({
          next: (res: FolderClass) => {
            folderId = res.id;
            this.saveFilesWithFolderId(files, folderId)
          }
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
    this.fileService.saveFile(formData, this.userId)
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
    this.files$ = this.fileService.getAllFiles(this.userId);
    this.formatFileSize()
  }

  findAllFolders() {
    this.folders$ = this.folderService.findAllFolders(this.userId)
    this.formatFolderSize()
  }

  filterByNameAscending() {
    if (this.currentFolderId != '') {
      this.folderFiles$ = this.sharedService.filterFolderFilesByNameAsc(this.folderFiles$);
    } else if (this.currentFolderId == '') {
      this.files$ = this.sharedService.filterFilesByNameAsc(this.files$);
      this.folders$ = this.sharedService.filterFoldersByNameAsc(this.folders$);
    }

  }

  filterByNameDescending() {
    if (this.currentFolderId != '') {
      this.folderFiles$ = this.sharedService.filterFolderFilesByNameDesc(this.folderFiles$)
    } else if (this.currentFolderId == '') {
      this.files$ = this.sharedService.filterFilesByNameDesc(this.files$);
      this.folders$ = this.sharedService.filterFoldersByNameDesc(this.folders$);
    }
  }

  filterByDateAscending() {
    if (this.currentFolderId != '') {
      this.folderFiles$ = this.sharedService.filterFolderFilesByDateAsc(this.folderFiles$)
    } else if (this.currentFolderId == '') {
      this.files$ = this.sharedService.filterFilesByDateAsc(this.files$);
      this.folders$ = this.sharedService.filterFoldersByDateAsc(this.folders$);
    }
  }

  filterByDateDescending() {
    if (this.currentFolderId != '') {
      this.folderFiles$ = this.sharedService.filterFolderFilesByDateDesc(this.folderFiles$)
    } else if (this.currentFolderId == '') {
      this.files$ = this.sharedService.filterFilesByDateDesc(this.files$);
      this.folders$ = this.sharedService.filterFoldersByDateDesc(this.folders$);
    }
  }

  filterBySizeAscending() {
    if (this.currentFolderId != '') {
      this.filterFolderFilesBySizeAsc();
    } else if (this.currentFolderId == '') {
      this.filterFilesAndFoldersBySizeAsc();
    }
  }

  filterBySizeDescending() {
    if (this.currentFolderId != '') {
      this.filterFolderFilesBySizeDesc();
    } else if (this.currentFolderId == '') {
      this.filterFilesAndFoldersBySizeDesc();
    }
  }

  filterFolderFilesBySizeAsc() {
    this.folderFiles$ = this.folderService.findAllFilesByFolderId(this.currentFolderId);
    this.folderFiles$ = this.folderFiles$.pipe(map((folderFiles) => {
      folderFiles.sort((a, b) => {
        return +a.size < +b.size ? -1 : 1;
      });
      return folderFiles;
    }));
    this.formatFolderFileSize()
  }

  filterFolderFilesBySizeDesc() {
    this.folderFiles$ = this.folderService.findAllFilesByFolderId(this.currentFolderId);
    this.folderFiles$ = this.folderFiles$.pipe(map((folderFiles) => {
      folderFiles.sort((a, b) => {
        return +b.size < +a.size ? -1 : 1;
      });
      return folderFiles;
    }));
    this.formatFolderFileSize();
  }

  filterFilesAndFoldersBySizeAsc() {
    this.files$ = this.fileService.getAllFiles(this.userId)
    this.files$ = this.files$.pipe(map((files) => {
      files.sort((a, b) => {
        return +a.size < +b.size ? -1 : 1;
      });
      return files;
    }))

    this.folders$ = this.folderService.findAllFolders(this.userId)
    this.folders$ = this.folders$.pipe(map((folders) => {
      folders.sort((a, b) => {
        return +a.size < +b.size ? -1 : 1;
      });
      return folders;
    }))

    this.formatFileSize()
    this.formatFolderSize()
  }

  filterFilesAndFoldersBySizeDesc() {
    this.files$ = this.fileService.getAllFiles(this.userId)
    this.files$ = this.files$.pipe(map((files) => {
      files.sort((a, b) => {
        return +b.size < +a.size ? -1 : 1;
      });
      return files;
    }))

    this.folders$ = this.folderService.findAllFolders(this.userId)
    this.folders$ = this.folders$.pipe(map((folders) => {
      folders.sort((a, b) => {
        return +b.size < +a.size ? -1 : 1;
      });
      return folders;
    }))

    this.formatFileSize()
    this.formatFolderSize()
  }

  closeFolder() {
    this.lookingAtFolder = false;
    this.folderDisplay = 'block';
    this.currentFolderId = '';
    this.addButtonDisplay = 'flex';
  }



  openFileModal() {
    if (this.optionsModalDisplay == 'flex') {
      this.optionsModalDisplay = 'none'
    } else {
      this.optionsModalDisplay = 'flex'
    }
  }

  formatFolderFileSize() {
    this.folderFiles$ = this.folderFiles$.pipe(
      map(folderFiles => folderFiles.map(folderFiles => {
        folderFiles.size = this.sharedService.formatBytes(folderFiles.size as unknown as number);
        return folderFiles;
      }))
    );
  }

  formatFileSize() {
    this.files$ = this.files$.pipe(
      map(files => files.map(file => {
        file.size = this.sharedService.formatBytes(file.size as unknown as number);
        return file;
      }))
    );
  }

  formatFolderSize() {
    this.folders$ = this.folders$.pipe(
      map(folders => folders.map(folder => {
        folder.size = this.sharedService.formatBytes(folder.size as unknown as number);
        return folder;
      }))
    );
  }

}

