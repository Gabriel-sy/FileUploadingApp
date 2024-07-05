import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { FileClass } from '../file/File';
import { FolderService } from '../../services/folder.service';
import { SharedService } from '../../services/shared.service';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-folder-files',
  templateUrl: './folder-files.component.html',
  styleUrl: './folder-files.component.css'
})
export class FolderFilesComponent implements OnInit, OnDestroy {

  fileId: string = '';
  fileName: string = '';
  @Input() folderFiles$: Observable<FileClass[]> = new Observable<FileClass[]>();
  modalDisplay: string = 'none'
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
    private sharedService: SharedService, private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  stopPropagation(event: Event) {
    event.stopPropagation();
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

  deleteFile(id: string, folderId: string) {
    this.deleteFileConfirm(id, folderId)
  }

  findAllFilesByFolderId(folderId: string) {
    this.folderFiles$ = this.folderService.findAllFilesByFolderId(folderId)
    this.formatFolderFileSize()
  }

  openModal(file: FileClass) {
    if (file.isModalOpen) {
      file.isModalOpen = false;
    } else {
      file.isModalOpen = true;
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

  deleteFileConfirm(fileId: string, folderId: string) {
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
        this.deleteFileFormatAndUpdate(fileId, folderId)

        this.messageService.add({ severity: 'info', summary: 'Removido com sucesso!', detail: 'Arquivo/pasta removidos com sucesso!', life: 3000 });
        this.confirmationService.close();
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }

  deleteFileFormatAndUpdate(fileId: string, folderId: string) {
    this.fileService.deleteFile(fileId)
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe({
        complete: () => {
          this.findAllFilesByFolderId(folderId);
        }
      });
  }
}
