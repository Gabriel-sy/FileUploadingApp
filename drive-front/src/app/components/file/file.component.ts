import { Component } from '@angular/core';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrl: './file.component.css'
})
export class FileComponent {

  modalDisplay: string = 'none'

  openModal() {
    if (this.modalDisplay == 'block') {
      this.modalDisplay = 'none';
    } else {
      this.modalDisplay = 'block'
    }

  }
}
