import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent implements OnInit {
  titleCard: string = '';
  
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
