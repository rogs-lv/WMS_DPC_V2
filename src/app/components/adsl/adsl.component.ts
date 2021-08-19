import { Component, OnInit, ViewChild } from '@angular/core';
import { BPAdsl } from 'src/app/models/adsl';
import { ADSLService } from 'src/app/service/adsl/adsl.service';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { ServiceLayer } from 'src/app/service/shared/ServicesLayer.service';
import { SnakbarComponent } from '../shared/snakbar/snakbar.component';

@Component({
  selector: 'app-adsl',
  templateUrl: './adsl.component.html',
  styleUrls: ['./adsl.component.css']
})
export class AdslComponent implements OnInit {
  @ViewChild(SnakbarComponent, {static: true}) childSnak: SnakbarComponent;

  private gridApi;
  private gridColumnApi;
  stayScrolledToEnd = true;

  textActions: string = '';
  loading: boolean = false;
  processRead: boolean = false;
  readManual: boolean = false;
  fieldLabel: string = '';
  client: BPAdsl;
  
  columnDefs = [
    { headerName: '#', valueGetter: 'node.rowIndex + 1', resizable: false, width: 45},
    { headerName: 'Lote', field: 'DistNumber', resizable: true, width: 170 },
    { headerName: 'Cantidad', field: 'Quantity', resizable: true, width: 100 },
    { headerName: 'Articulo', field: 'ItemCode', resizable: true, width: 150, hide: true},
    { headerName: 'Descripción' ,field: 'ItemName', resizable: true, width: 300}
  ];
  rowData = [];

  constructor(
    private auth: AuthService,
    private serviceLayer: ServiceLayer,
    private serviceADSL: ADSLService 
  ) { 
    this.client = new BPAdsl();
  }

  ngOnInit() {
    this.getListPartners();
    localStorage.setItem('lastOnePage', window.location.pathname);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  async onSubmit() {
    this.loading = true;
    //console.log(this.rowData);
    const {IdUser, WhsCode} = this.auth.getDataToken();
    const date = new Date();
    const dateDelivery = `${date.getFullYear()}${("0" + (date.getMonth() + 1)).slice(-2)}${("0" + date.getDate()).slice(-2)}`;
    
    const response = await this.serviceADSL.processData(this.rowData, this.client.partner, IdUser ).toPromise().catch(err=>{
      this.childSnak.openSnackBar(`Error al procesar los datos de la entrega${err.message}`, 'Cerrar','warning-snackbar');
      this.loading = false;
    }); 
    if(response.Data.CardCode) {
      const value = this.serviceLayer.sessionIsValid();
      if(!value) {
        const session = await this.serviceLayer.doLoginSL().toPromise().catch(err => {
          this.childSnak.openSnackBar(err.error.error.message.value, 'Cerrar','warning-snackbar');
          this.loading = false;
          return;
        }); // return json
        this.generateDelivery(response, dateDelivery);
      } else {
        this.generateDelivery(response, dateDelivery);
      }
    } else {
      this.childSnak.openSnackBar(`No se recupero información para generar el documento`,'Cerrar','success-snackbar');
      this.loading = false;
    }
  }

  generateDelivery(response: any, dateDelivery: any) {
    this.serviceADSL.createDelivery(response.Data).subscribe(result => {
      console.log(result);
      if(result.DocEntry) {
        const rows = this.rowData;
        this.updateUserFieldBatch(rows, dateDelivery, response.Data.U_HoraMov);
        this.childSnak.openSnackBar(`Entrega generada: ${result.DocNum}`,'Cerrar','success-snackbar');
        this.loading = false;
        this.onReset();
      }
    }, (err) => {
      this.childSnak.openSnackBar(`${err.error.error.message.value}`, 'Cerrar','warning-snackbar');
      this.loading = false;
    });      
  }


  updateUserFieldBatch(batchs: any, dateOut: string, timeOut: string){
    for (let bt of batchs) {
      this.serviceADSL.updateBatchDelivery(bt.AbsEntryBatch, dateOut, timeOut).subscribe(result => {
      }, (err) => {
        this.childSnak.openSnackBar(`${err.error.error.message.value}`, 'Cerrar','warning-snackbar');
      });
    }
  }
  
  onReset(){
    this.rowData = [];
    this.gridApi.setRowData([]);
    this.client.partner = "";
  }

  existCodebars(codebars: string) : boolean {
    let result = false;
    this.gridApi.forEachNode(node => {
      if(node.data.DistNumber === codebars) result = true;
    });
    return result;
  }

  readCodebars(event) {
    const { WhsCode } = this.auth.getDataToken();
    const { ListNum } = this.client.listPartner.find(x => x.CardCode === this.client.partner);
    if(!this.existCodebars(event)) {
      this.serviceADSL.getBatch(event, WhsCode, ListNum).subscribe(response => {
        if(response.Code === 0) {
          const { AbsEntryBatch, DistNumber, BinCode, AbsEntry, ItemCode, ItemName, Quantity, WhsCode, Status, InDate, Estancia, PriceList, Price } = response.Data[0];
          this.rowData.push({AbsEntryBatch: AbsEntryBatch, DistNumber: DistNumber, BinCode: BinCode, AbsEntry: AbsEntry, ItemCode: ItemCode, ItemName: ItemName, Quantity: Quantity, WhsCode: WhsCode, Status: Status, InDate: InDate, Estancia: Estancia, PriceList: PriceList, Price: Price });
          this.gridApi.setRowData(this.rowData);
          this.fieldLabel = '';
          //this.addRowTable(response.Data[0]);
        } else {
          this.childSnak.openSnackBar(response.Message, 'Cerrar','warning-snackbar');
          this.fieldLabel = '';
        }
      }, (err) => {
        this.childSnak.openSnackBar(err.message, 'Cerrar','warning-snackbar');
        this.fieldLabel = '';
      });
    } else {
      setTimeout( () => {
        this.childSnak.openSnackBar('El lote ya fue leído', 'Cerrar','warning-snackbar');
        this.fieldLabel = '';
      }, 100);
    }
  }

  getListPartners() {
    this.serviceADSL.getListPartners().subscribe(response => {
      this.client.listPartner = response.Data;
    }, (err) => {
      this.childSnak.openSnackBar(err.message, 'Cerrar','warning-snackbar');
    });
  }

  onClickReadManual() {
    this.fieldLabel = '';
    !this.readManual ? this.readManual = true : this.readManual = false;
  }

  addLabelManual() {
    this.readCodebars(this.fieldLabel);
  }

  onRemoveSelected() {
    const selectedData = this.gridApi.getSelectedRows();

    let temp = this.rowData.filter((element) => {
      return selectedData.indexOf(element) < 0;
    });

    this.rowData = temp;
    this.gridApi.applyTransaction({ remove: selectedData });
    this.gridApi.applyTransaction({ update: this.rowData});

  }

  handleRowDataChanged(event) {
    const index = this.rowData.length - 1;
    if (this.stayScrolledToEnd) {
      this.gridApi.ensureIndexVisible(index, 'bottom');
    }
  }
}
