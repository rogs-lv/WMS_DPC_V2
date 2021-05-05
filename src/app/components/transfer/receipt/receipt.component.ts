import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { ConfigurationService } from 'src/app/service/configuration/configuration.service';
import { ServiceLayer } from 'src/app/service/shared/ServicesLayer.service';
import { TransferService } from 'src/app/service/transfer/transfer.service';
import { SnakbarComponent } from '../../shared/snakbar/snakbar.component';
import { DataReceipt, DocumentTransferReceipt } from '../../../models/transfer';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {
  @ViewChild(SnakbarComponent, {static: true}) childSnak: SnakbarComponent;

  private gridApi;
  private gridColumnApi;
  stayScrolledToEnd = true;

  textActions: string = '';
  loading: boolean = false;
  processRead: boolean = false;
  readManual: boolean = false;
  fieldLabel: string = '';
  numReceipt: number;

  memoryDocument: DocumentTransferReceipt;

  columnDefs = [
    { headerName: '#', valueGetter: 'node.rowIndex + 1', resizable: false, width: 45},
    { headerName: 'Lote', field: 'DistNumber', resizable: true, width: 170 },
    { headerName: 'Cantidad', field: 'Quantity', resizable: true, width: 100, },
    { headerName: 'Articulo', field: 'ItemCode', resizable: true, width: 150, hide: true},
    { headerName: 'Descripción' ,field: 'Dscripción', resizable: true, width: 300}
  ];

  rowData = [];

  constructor(
    private transferService: TransferService,
    private auth: AuthService,
    private configService: ConfigurationService,
    private serviceLayer: ServiceLayer
  ) { 
    this.memoryDocument = new DocumentTransferReceipt();
  }

  ngOnInit() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  async onSubmit() {
    this.loading = true;

    const {IdUser, WhsCode} = this.auth.getDataToken();
    //Get serie with endpoint Configuration - API Rest
    const { Data: serie} = await  this.configService.getSerieToDocument(WhsCode).toPromise().catch( err => {
      this.childSnak.openSnackBar('No ser recupero número de serie', 'Cerrar','warning-snackbar');
    });
    let data: DataReceipt;
    data = new DataReceipt();
    data.batchs = this.rowData;
    data.receipt = this.memoryDocument;
    const response = await this.transferService.processReceipt(data).toPromise().catch(err=>{
      this.childSnak.openSnackBar(`Error al procesar los datos ${err.message}`, 'Cerrar','warning-snackbar');
      this.loading = false;
    });    
    console.log(response.Data);
    if(response) {
      const value = this.serviceLayer.sessionIsValid();
      if(!value){
          const session = await this.serviceLayer.doLoginSL().toPromise(); // return json
      }
      response.Data.Series = serie;
      response.Data.U_UsrHH = IdUser;
      this.transferService.createTransfer(response.Data).subscribe(result => {
        if(result.DocEntry) {
          this.childSnak.openSnackBar(`Transferencia generada: ${result.DocNum}`,'Cerrar','success-snackbar');
          this.loading = false;
          this.onReset();
        }
      }, (err) => {
        this.childSnak.openSnackBar(`${err.error.error.message.value}`, 'Cerrar','warning-snackbar');
        this.loading = false;
      });
    }
  }

  readCodebars(event) {
    if(!this.existCodebars(event)){
      this.transferService.getBatch(event, this.memoryDocument.Document.ToWhsCode).subscribe(response => {
        if(response.Code === 0) {
          //if itemcode === item memory
          const { AbsEntryBatch, DistNumber, BinCode, AbsEntry, ItemCode, ItemName, Quantity, WhsCode, Status } = response.Data[0];
          if(this.existItemCodeMemory(ItemCode)) {
            this.rowData.push({AbsEntryBatch: AbsEntryBatch, DistNumber: DistNumber, BinCode: BinCode, AbsEntry: AbsEntry, ItemCode: ItemCode, ItemName: ItemName, Quantity: Quantity, WhsCode: WhsCode, NewBinCode: '', NewAbsEntry: ''  });
            this.gridApi.setRowData(this.rowData);
            this.fieldLabel = '';
          } else {
            this.childSnak.openSnackBar(`El artículo ${ItemCode} NO existe en el documento: ${this.numReceipt}`, 'Cerrar','warning-snackbar');
            this.fieldLabel = '';
          }
        }
        else {
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

  existCodebars(codebars: string) : boolean {
    let result = false;
    this.gridApi.forEachNode(node => {
      if(node.data.DistNumber === codebars) result = true;
    });
    return result;
  }

  existItemCodeMemory(itemCode: string) : boolean {
    const val = this.memoryDocument.DetailDocument.findIndex(val => val.ItemCode === itemCode);    
    return val !== -1 ? true : false;
  }

  onLoadDocument() {
    const {IdUser, WhsCode} = this.auth.getDataToken();
    this.transferService.getDocumentsReceipt(WhsCode, this.numReceipt).subscribe(response => {
      if(response.Data.Document){
        this.memoryDocument = response.Data;
        this.childSnak.openSnackBar('Documento cargado correctamente', 'Cerrar','success-snackbar');
      } else {
        this.childSnak.openSnackBar('El documento que ingreso no existe', 'Cerrar','warning-snackbar');
      }
    }, (err) => {
      this.childSnak.openSnackBar(err.message, 'Cerrar','warning-snackbar');
    })
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

  onReset(){
    this.rowData = [];
    this.gridApi.setRowData([]);
    this.numReceipt = null;
    this.memoryDocument = new DocumentTransferReceipt();
  }
}
