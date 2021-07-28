import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AvailableLocation } from 'src/app/models/location';

@Component({
  selector: 'app-suggested',
  templateUrl: './suggested.component.html',
  styleUrls: ['./suggested.component.css']
})
export class SuggestedComponent implements OnInit {
  rowSelected: any;
  constructor(
    public dialogRef: MatDialogRef<SuggestedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AvailableLocation[]
  ) { }

  ngOnInit() {
  }

  onNoClick(value:any) {
    this.rowSelected = value;
    this.dialogRef.close();
  }
}
