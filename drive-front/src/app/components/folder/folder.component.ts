import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FileService } from '../../services/upload/file.service';
import { FolderService } from '../../services/upload/folder.service';
import { FolderClass } from '../../domain/Folder';
import { SharedService } from '../../services/shared.service';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.css'
})
export class FolderComponent implements OnInit, OnDestroy {

  modalDisplay: string = 'none'
  @Input() folders$: Observable<FolderClass[]> = new Observable<FolderClass[]>();
  @Output() lookingAtFolder = new EventEmitter<boolean>()
  @Output() currentFolderId = new EventEmitter<string>()
  @Input() userId: string = ''
  unsubscribeSignal: Subject<void> = new Subject();

  constructor(private fileService: FileService,
    private folderService: FolderService,
    private sharedService: SharedService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.formatFolderSize()
  }

  ngOnDestroy(): void {
    this.unsubscribeSignal.next()
    this.unsubscribeSignal.unsubscribe()
  }

  downloadFile(id: string, name: string) {
    this.sharedService.downloadFile(id, name);
  }

  deleteFolder(folderId: string) {
    this.deleteFolderConfirm(folderId)
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

  openModal(folder: FolderClass) {
    if (folder.isModalOpen) {
      folder.isModalOpen = false;
    } else {
      folder.isModalOpen = true;
    }
  }

  deleteFolderConfirm(folderId: string) {
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
        this.deletefilesAndFolder(folderId)

        this.messageService.add({ severity: 'info', summary: 'Removido com sucesso!', detail: 'Arquivo/pasta removidos com sucesso!', life: 3000 });
        this.confirmationService.close();
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }

  deletefilesAndFolder(folderId: string) {
    this.folderService.deleteFolder(folderId)
      .pipe(takeUntil(this.unsubscribeSignal))
      .subscribe({
        next: () => this.deletefilesByFolderid(folderId)
      })
  }

}
