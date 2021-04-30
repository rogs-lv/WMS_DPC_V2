import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { InventoryService } from 'src/app/service/inventory/inventory.service';
import { BatchInLocation } from '../../../../models/batch';

@Component({
  selector: 'app-location-batch',
  templateUrl: './location-batch.component.html',
  styleUrls: ['./location-batch.component.css']
})
export class LocationBatchComponent implements OnInit {
  /* dataSend: BatchInLocation[];   */
  /* rowsBatch: BatchInLocation[]; */

  constructor(
    public dialogRef: MatDialogRef<LocationBatchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BatchInLocation[]
  ) { 
    /* this.dataSend = []; */
    /* this.rowsBatch = []; */
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
