export class FileClass {
  id: string;
  originalName: string;
  name: string
  size: string;
  createdDate: string;
  type: string;
  fileBytes: string[];
  isModalOpen: boolean;
  folderId: string;

  constructor(id: string, originalName: string, size: string, type: string, fileBytes: string[], createdDate: string, isModalOpen: boolean, name: string, folderId: string) {
    this.folderId = folderId;
    this.name = name
    this.isModalOpen = isModalOpen;
    this.createdDate = createdDate;
    this.id = id;
    this.originalName = originalName;
    this.size = size;
    this.type = type;
    this.fileBytes = fileBytes;
  }
}