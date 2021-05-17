import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-multibatch',
  templateUrl: './multibatch.component.html',
  styleUrls: ['./multibatch.component.css']
})
export class MultibatchComponent implements OnInit {
  rowSelected: any;

  constructor(
    public dialogRef: MatDialogRef<MultibatchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[]
  ) { }

  ngOnInit() {
  }
  onYesClick(value:any) {
    this.rowSelected = value;
    this.dialogRef.close();
  }
  onCloseClick() {
    this.dialogRef.close();
  }
}
