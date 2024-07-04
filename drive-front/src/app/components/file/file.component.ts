import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FileClass } from './File';
import { FileService } from '../../services/file.service';
import { SharedService } from '../../services/shared.service';
import { Observable, Subject, map, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrl: './file.component.css'
})
export class FileComponent implements OnInit, OnDestroy {


  txtModalDisplay: string = 'none';
  modalDisplay: string = 'none'
  txtFileContent: string = '';
  txtFileTitle: string = '';
  // @Input() files$: FileClass[] = []
  @Input() files$: Observable<FileClass[]> = new Observable<FileClass[]>();
  @Input() userId: string = '';
  unsubscribeSignal: Subject<void> = new Subject();

  constructor(private fileService: FileService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.formatFileSize()
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

  deleteFile(id: string) {
    this.fileService.deleteFile(id)
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe({
        next: () => this.findAllFiles()
      })
  }

  findAllFiles() {
    this.files$ = this.fileService.getAllFiles(this.userId)
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  closeTxtModal() {
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

  formatFileSize() {
    this.files$ = this.files$.pipe(
      map(files => files.map(file => {
        file.size = this.sharedService.formatBytes(file.size as unknown as number);
        return file;
      }))
    );
  }

}
