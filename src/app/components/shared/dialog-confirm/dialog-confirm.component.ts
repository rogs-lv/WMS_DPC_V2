import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.css']
})
export class DialogConfirmComponent implements OnInit {
  closeMessage: string = "";  
  

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmComponent>) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.closeMessage = "No";
    this.dialogRef.close();
  }
  onYesClick(): void {
    this.closeMessage = "Yes";
    this.dialogRef.close();
  }
}
