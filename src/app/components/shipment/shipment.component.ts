import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.css']
})
export class ShipmentComponent implements OnInit {
  titleCard: string = '';
  processRead: boolean = false;
  
  columnDefs = [
    { field: 'Lote', resizable: true, width: 300, },
    { field: 'Cantidad', resizable: true, width: 300, },
    { field: 'Descripción', resizable: true, width: 300,}
  ];

  rowData = [
    { Lote: '2104071234501', Cantidad: 35000, Descripción: 'Celica' },
    { Lote: '2104071234502', Cantidad: 32000, Descripción: 'Mondeo'},
    { Lote: '2104071234503', Cantidad: 72000, Descripción: 'Boxter' }
  ];

  constructor() { }

  ngOnInit() {
  }
  onSubmit() {}

}
