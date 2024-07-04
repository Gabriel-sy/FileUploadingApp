import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { FileClass } from '../file/File';
import { FolderService } from '../../services/folder.service';
import { SharedService } from '../../services/shared.service';
import { Observable, Subject, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-folder-files',
  templateUrl: './folder-files.component.html',
  styleUrl: './folder-files.component.css'
})
export class FolderFilesComponent implements OnInit, OnDestroy {

  @Input() folderFiles$: Observable<FileClass[]> = new Observable<FileClass[]>();
  txtModalDisplay: string = 'none';
  modalDisplay: string = 'none'
  txtFileContent: string = '';
  txtFileTitle: string = '';
  @Input() currentFolderId: string = '';
  unsubscribeSignal: Subject<void> = new Subject();

  ngOnInit(): void {
    this.folderFiles$ = this.folderService.findAllFilesByFolderId(this.currentFolderId)
    this.formatFolderFileSize();
  }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }

  constructor(private folderService: FolderService,
    private fileService: FileService,
    private sharedService: SharedService) { }

  stopPropagation(event: Event) {
    event.stopPropagation();
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

  deleteFile(id: string, folderId: string) {
    this.fileService.deleteFile(id)
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe({
        next: () => this.findAllFilesByFolderId(folderId)
      })
  }

  findAllFilesByFolderId(folderId: string) {
    this.folderFiles$ = this.folderService.findAllFilesByFolderId(folderId)
    this.formatFolderFileSize()
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

  formatFolderFileSize() {
    this.folderFiles$ = this.folderFiles$.pipe(
      map(folderFiles => folderFiles.map(folderFiles => {
        folderFiles.size = this.sharedService.formatBytes(folderFiles.size as unknown as number);
        return folderFiles;
      }))
    );
  }
}
