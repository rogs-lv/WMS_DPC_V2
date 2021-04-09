import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  titleCard: string = '';
  processRead: boolean = false;
  
  columnDefs = [
    { field: 'Lote', resizable: true, width: 150, },
    { field: 'CtdSAP', resizable: true, width: 150, },
    { field: 'CtdCtda.', resizable: true, width: 150, },
    { field: 'Ubicación', resizable: true, width: 300, },
    { field: 'Articulo', resizable: true, width: 150, },
    { field: 'Almacen', resizable: true, width: 200,},
    { field: 'DescArt.', resizable: true, width: 300,}
  ];

  rowData = [
    { Lote: '2104071234501', CtdSAP: 0, CtdCtda: 1, Ubicacion: 'UBI-01-01-02', Articulo: 'Art1', Almacen: 'Whs01', DescArt: 'Celica' },
    { Lote: '2104071234502', CtdSAP: 0, CtdCtda: 1, Ubicacion: 'UBI-01-01-02', Articulo: 'Art2', Almacen: 'Whs02', DescArt: 'Mondeo'},
    { Lote: '2104071234503', CtdSAP: 0, CtdCtda: 1, Ubicacion: 'UBI-01-01-02', Articulo: 'Art3', Almacen: 'Whs03', DescArt: 'Boxter' }
  ];

  constructor() { }

  ngOnInit() {
  }
  onSubmit(){}
}
