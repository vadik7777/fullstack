import {Component, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  item: string;
  editable: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html'
})
export class DialogComponent {

  itemCancel: string;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.itemCancel = data.item;
  }
}
