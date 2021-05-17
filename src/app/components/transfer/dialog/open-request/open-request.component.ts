import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-open-request',
  templateUrl: './open-request.component.html',
  styleUrls: ['./open-request.component.css']
})
export class OpenRequestComponent implements OnInit {
  rowSelected: any;
  constructor(
    public dialogRef: MatDialogRef<OpenRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[]
  ) { }

  ngOnInit() {
  }

  onNoClick(value:any) {
    this.rowSelected = value;
    this.dialogRef.close();
  }
  onCloseClick() {
    this.dialogRef.close();
  }
}
