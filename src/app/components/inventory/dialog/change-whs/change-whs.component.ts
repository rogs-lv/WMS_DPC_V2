import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-change-whs',
  templateUrl: './change-whs.component.html',
  styleUrls: ['./change-whs.component.css']
})
export class ChangeWhsComponent implements OnInit {
  closeMessage: string = "";  

  constructor(
    public dialogRef: MatDialogRef<ChangeWhsComponent>
    ) { }

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
