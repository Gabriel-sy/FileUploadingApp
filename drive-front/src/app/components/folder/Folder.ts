export class FolderClass {
  id: string;
  name: string;
  createdTime: string;
  size: string;
  isModalOpen: boolean;
  constructor(id: string, name: string, createdTime: string, size: string, isModalOpen: boolean) {
    this.isModalOpen = isModalOpen;
    this.size = size;
    this.createdTime = createdTime;
    this.id = id;
    this.name = name;
  }
}