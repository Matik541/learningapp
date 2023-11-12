import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      content: string;

      confirm?: {
        text: string;
        color?: string;
      };
      cancel?: {
        text: string;
        color?: string;
      };
    }
  ) {}

  confirm() {
    return true;
  }
  cancel() {
    return false;
  }
}
