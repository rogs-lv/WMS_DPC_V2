import { Component, OnInit} from '@angular/core';
@Component({
  selector: 'app-quality',
  templateUrl: './quality.component.html',
  styleUrls: ['./quality.component.css']
})
export class QualityComponent implements OnInit {

  processRead: boolean = false;
  textAction: string = '';
  titleCard: string = '';
  checkBox = {
    bloq: false,
    desbloq: false,
    move: false
  }
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
  
  onProcessRead() {
    this.processRead = true;
    /* console.table(this.checkBox); */
  }
  onCancelProcessRead() {
    this.processRead = false;
  }
  onChangeCheckBox(event) {
    if(this.checkBox.bloq)
      this.titleCard = 'Bloqueo';
    else if (this.checkBox.desbloq)
      this.titleCard = 'Desbloqueo';
    else if (this.checkBox.bloq && this.checkBox.move)
      this.titleCard = 'Bloqueo y Movimiento';
    else if (this.checkBox.desbloq && this.checkBox.move)
      this.titleCard = 'Desbloqueo y Movimiento';
  }
}
