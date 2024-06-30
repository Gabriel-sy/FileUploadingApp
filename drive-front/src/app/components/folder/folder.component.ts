import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FileService } from '../../services/file.service';
import { FileClass } from '../file/File';
import { FolderService } from '../../services/folder.service';
import { FolderClass } from './Folder';
import { SharedService } from '../../services/shared.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.css'
})
export class FolderComponent implements OnInit, OnDestroy {

  txtModalDisplay: string = 'none';
  modalDisplay: string = 'none'
  txtFileContent: string = '';
  txtFileTitle: string = '';
  @Input() folders$: FolderClass[] = [];
  @Output() lookingAtFolder = new EventEmitter<boolean>()
  @Output() currentFolderId = new EventEmitter<string>()
  unsubscribeSignal: Subject<void> = new Subject();

  constructor(private fileService: FileService, private folderService: FolderService, private sharedService: SharedService) { }

  ngOnInit(): void {
    for (let i = 0; i < this.folders$.length; i++) {
      //Formatando o tamanho da pasta.
      const size: string = this.sharedService.formatBytes(this.folders$[i].size as unknown as number);
      this.folders$[i].size = size;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }

  openFile(id: string, name: string) {
    if (name.includes(".pdf")) {
      this.sharedService.openPdf(id)
    } else if (name.includes(".txt")) {
      this.openTxt(id, name)
    }
  }

  downloadFile(id: string, name: string) {
    this.sharedService.downloadFile(id, name);
  }

  openTxt(id: string, name: string) {
    this.txtModalDisplay = 'flex'
    this.fileService.getFileContent(id)
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe((res: string) => {
        this.txtFileContent = res;
        this.txtFileTitle = name.replace(".txt", "");
      })
  }

  deleteFolder(folderId: string) {
    this.folderService.deleteFolder(folderId)
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe({
        next: () => this.deletefilesByFolderid(folderId)
      })
  }

  deletefilesByFolderid(folderId: string){
    this.fileService.deleteFilesByFolderId(folderId)
    .pipe(takeUntil(this.unsubscribeSignal))
    .subscribe({
      complete: () => this.findAllFolders()
    })
  }

  findAllFolders() {
    this.folderService.findAllFolders()
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe((res: FolderClass[]) =>
        this.folders$ = res)
  }

  openFolder() {
    this.lookingAtFolder.emit(true)
  }

  setCurrentFolder(folderId: string) {
    this.currentFolderId.emit(folderId)
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  closeTxtModal() {
    this.txtModalDisplay = 'none';
  }

  openModal(folder: FolderClass) {
    if (folder.isModalOpen) {
      folder.isModalOpen = false;
    } else {
      folder.isModalOpen = true;
    }
  }

  closeModal() {
    this.txtModalDisplay = 'none'
  }
}
