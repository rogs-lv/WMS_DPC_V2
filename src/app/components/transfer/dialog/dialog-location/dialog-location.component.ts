import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BatchInLocation } from 'src/app/models/batch';

@Component({
  selector: 'app-dialog-location',
  templateUrl: './dialog-location.component.html',
  styleUrls: ['./dialog-location.component.css']
})
export class DialogLocationComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BatchInLocation[]
  ) { }

  ngOnInit() {
  }

  onYesClick(): void {
    this.dialogRef.close();
  }
}
