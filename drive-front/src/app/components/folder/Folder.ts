export class FolderClass {
  id: string;
  name: string;
  createdTime: string;
  size: string;

  constructor(id: string, name: string, createdTime: string, size: string) {
    this.size = size;
    this.createdTime = createdTime;
    this.id = id;
    this.name = name;
  }
}