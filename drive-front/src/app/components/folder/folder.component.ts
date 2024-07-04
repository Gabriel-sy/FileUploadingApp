import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FileService } from '../../services/file.service';
import { FileClass } from '../file/File';
import { FolderService } from '../../services/folder.service';
import { FolderClass } from './Folder';
import { SharedService } from '../../services/shared.service';
import { Observable, Subject, map, takeUntil } from 'rxjs';

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
  // @Input() folders$: FolderClass[] = [];
  @Input() folders$: Observable<FolderClass[]> = new Observable<FolderClass[]>();
  @Output() lookingAtFolder = new EventEmitter<boolean>()
  @Output() currentFolderId = new EventEmitter<string>()
  @Input() userId: string = ''
  unsubscribeSignal: Subject<void> = new Subject();

  constructor(private fileService: FileService, private folderService: FolderService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.formatFolderSize()
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

  deletefilesByFolderid(folderId: string) {
    this.fileService.deleteFilesByFolderId(folderId)
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe()
    this.findAllFolders()
  }

  findAllFolders() {
    this.folders$ = this.folderService.findAllFolders(this.userId)
    this.formatFolderSize()
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

  formatFolderSize() {
    this.folders$ = this.folders$.pipe(
      map(folders => folders.map(folder => {
        folder.size = this.sharedService.formatBytes(folder.size as unknown as number);
        return folder;
      }))
    );
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
