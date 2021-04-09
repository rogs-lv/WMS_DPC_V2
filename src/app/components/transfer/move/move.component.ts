import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-move',
  templateUrl: './move.component.html',
  styleUrls: ['./move.component.css']
})
export class MoveComponent implements OnInit {
  titleCard: string = '';
  
  columnDefs = [
    { field: 'Lote', resizable: true, width: 150, },
    { field: 'UbiAnt', resizable: true, width: 200, },
    { field: 'UbiNueva', resizable: true, width: 200, },
    { field: 'Descripción', resizable: true, width: 200,}
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
