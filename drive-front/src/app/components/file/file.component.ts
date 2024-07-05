import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, output } from '@angular/core';
import { FileClass } from './File';
import { FileService } from '../../services/file.service';
import { SharedService } from '../../services/shared.service';
import { BehaviorSubject, Observable, Subject, Subscription, map, takeUntil, tap } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';



@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrl: './file.component.css'
})
export class FileComponent implements OnInit, OnDestroy {

  fileId: string = '';
  fileName: string = '';
  modalDisplay: string = 'none'

  @Input() userId: string = '';
  filesSubject = new BehaviorSubject<FileClass[]>([]);
  @Input() files$: Observable<FileClass[]> = new Observable<FileClass[]>()
  unsubscribeSignal: Subject<void> = new Subject();

  constructor(private fileService: FileService, private sharedService: SharedService, private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.formatFileSize()
  }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }

  openFile(id: string, name: string) {
    if (name.includes('pdf') || name.includes('txt')) {
      this.sharedService.openPdfOrTxt(id)
    } else {
      this.fileId = id;
      this.fileName = name
      this.sharedService.openFileConfirm(this.fileId, this.fileName)
    }
  }

  downloadFile(id: string, name: string) {
    this.sharedService.downloadFile(id, name);
  }

  deleteFile(id: string) {
    this.deleteFileConfirm(id);
  }

  findAllFiles() {
    this.files$ = this.fileService.getAllFiles(this.userId)
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  openModal(file: FileClass) {
    if (file.isModalOpen) {
      file.isModalOpen = false;
    } else {
      file.isModalOpen = true;
    }    
  }

  closeModal(file: FileClass){
    file.isModalOpen = false;
  }


  formatFileSize() {
    this.files$ = this.files$.pipe(
      map(files => files.map(file => {
        file.size = this.sharedService.formatBytes(file.size as unknown as number);
        return file;
      }))
    );
  }

  deleteFileConfirm(fileId: string) {
    this.confirmationService.confirm({
      header: 'Remover',
      message: "Tem certeza que quer remover?",
      acceptLabel: "Remover",
      rejectLabel: "Cancelar",
      key: "delete",
      acceptIcon: 'pi pi-check mr-2',
      rejectIcon: 'pi pi-times mr-2',
      rejectButtonStyleClass: 'p-button-sm',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        this.deleteFileFormatAndUpdate(fileId)
        this.messageService.add({ severity: 'info', summary: 'Removido com sucesso!', detail: 'Arquivo/pasta removidos com sucesso!', life: 3000 });
        this.confirmationService.close();
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }

  

  deleteFileFormatAndUpdate(fileId: string) {
    this.fileService.deleteFile(fileId)
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe({
        complete: () => {
          this.findAllFiles();
          this.formatFileSize()
        }
      });
  }

}
