import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { ConfigurationService } from 'src/app/service/configuration/configuration.service';
import { ServiceLayer } from 'src/app/service/shared/ServicesLayer.service';
import { TransferService } from 'src/app/service/transfer/transfer.service';
import { SnakbarComponent } from '../../shared/snakbar/snakbar.component';
import { batchNumbers, binLocation, DataMovement, DocumentTransfer, transfer, transferLine } from '../../../models/transfer';
import { MatDialog } from '@angular/material';
import { OpenRequestComponent } from '../dialog/open-request/open-request.component';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  @ViewChild(SnakbarComponent, {static: true}) childSnak: SnakbarComponent;
  /* dataRequest = environment.dataForRequests; */

  rowData =[];
  private gridApi;
  private gridColumnApi;
  stayScrolledToEnd = true;

  textActions: string = '';
  loading: boolean = false;
  processRead: boolean = false;
  readManual: boolean = false;
  fieldLabel: string = '';

  memoryDocument: DocumentTransfer;
  numRequest: number;

  columnDefs = [
    { headerName: '#', valueGetter: 'node.rowIndex + 1', resizable: false, width: 45},
    { headerName: 'Lote', field: 'DistNumber', resizable: true, width: 170 },
    { headerName: 'Cantidad', field: 'Quantity', resizable: true, width: 100, editable: true, type: 'numericColumn', valueSetter: this.cellValidateQuantity.bind(this) },
    { headerName: 'Articulo', field: 'ItemCode', resizable: true, width: 150, hide: true},
    { headerName: 'Descripción', field: 'ItemName', resizable: true, width: 300,}
  ];

  constructor(
    private transferService: TransferService,
    private auth: AuthService,
    private configService: ConfigurationService,
    private serviceLayer: ServiceLayer,
    public dialog: MatDialog,
  ) { 
    this.memoryDocument = new DocumentTransfer();
  }

  ngOnInit() {
  }
  async onSubmit() {
    this.gridApi.forEachNode(node => {
      if(!node.data.Quantity){
        this.childSnak.openSnackBar(`El lote ${node.data.DistNumber} no puede quedarse con cantidad 0`, 'Cerrar','warning-snackbar');
        return;
      }
    });

    this.loading = true;

    const {IdUser, WhsCode} = this.auth.getDataToken();
    //Get serie with endpoint Configuration - API Rest
    const { Data: serie} = await  this.configService.getSerieToDocument(WhsCode).toPromise().catch( err => {
      this.childSnak.openSnackBar('No ser recupero número de serie', 'Cerrar','warning-snackbar');
    });
    
   /*  let whsAbsEntry;
    if(this.memoryDocument.Document.ToWhsCode === this.dataRequest.WhsForRequest) {
       whsAbsEntry = await this.transferService.getLocationWhs(this.memoryDocument.Document.ToWhsCode).toPromise().catch(err => {
        this.childSnak.openSnackBar('Error al recuperar ubicación destino', 'Cerrar','warning-snackbar');
      });
    } */

    let data: DataMovement;
    data = new DataMovement();
    data.batchs = this.rowData;
    data.request = this.memoryDocument;
    const response = await this.transferService.processData(data).toPromise().catch(err=>{
      this.childSnak.openSnackBar(`Error al procesar los datos ${err.message}`, 'Cerrar','warning-snackbar');
      this.loading = false;
    });    
    if(response){
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

  getLineItem(itemCode: string): number {
    const { LineNum } = this.memoryDocument.Detail.find(val => val.ItemCode === itemCode);
    return LineNum;
  }

  getBatchs(itemCode: string): batchNumbers[] {
    let batchs = [];
    for(let i = 0; i < this.rowData.length; i++) {
      if(itemCode === this.rowData[i].ItemCode){
        const { DistNumber, WhsCode, Quantity } = this.rowData[i];
        batchs.push(new batchNumbers(DistNumber, WhsCode, Quantity, i));
      }
    }
    return batchs;
  }

  getFromLocations(itemCode: string, action: number, line:number): binLocation[] {
    let locations = [];
    let j = 0;
    for(let i = 0; i < this.rowData.length; i++) {
      if(itemCode === this.rowData[i].ItemCode)  {
        const { DistNumber, WhsCode, Quantity, AbsEntry } = this.rowData[i];
        locations.push(new binLocation(AbsEntry, action, line, Quantity, i));
      }
    }
    return locations;
  }

  getBinLocations(itemCode: string, line:number, toAbsEntry: number): binLocation[] {
    let locations = [];
    for(let i = 0; i < this.rowData.length; i++) {
      if(itemCode === this.rowData[i].ItemCode)  {
        const { DistNumber, WhsCode, Quantity, AbsEntry } = this.rowData[i];
        locations.push(new binLocation(AbsEntry, 2, line, Quantity, i));
        locations.push(new binLocation(toAbsEntry, 1, line, Quantity, i))
      }
    }
    return locations;
  }

  getSumQuantity(batch: any[]) {
    let sumQuantity = 0;
    batch.map(val => {
      sumQuantity += Number.parseFloat(val.Quantity);
    })
    return sumQuantity;
  }
  readCodebars(event){
    if (!this.existCodebars(event)){
      const { WhsCode } = this.auth.getDataToken();
      this.transferService.getBatch(event, WhsCode).subscribe(response => {
        if(response.Code === 0) {
          //if itemcode === item memory
          const { AbsEntryBatch, DistNumber, BinCode, AbsEntry, ItemCode, ItemName, Quantity, WhsCode, Status } = response.Data[0];
          if(this.existItemCodeMemory(ItemCode)) {
            this.rowData.push({AbsEntryBatch: AbsEntryBatch, DistNumber: DistNumber, BinCode: BinCode, AbsEntry: AbsEntry, ItemCode: ItemCode, ItemName: ItemName, Quantity: Quantity, WhsCode: WhsCode, NewBinCode: '', NewAbsEntry: ''  });
            this.gridApi.setRowData(this.rowData);
            this.fieldLabel = '';
          } else {
            this.childSnak.openSnackBar(`El artículo ${ItemCode} NO existe en el documento: ${this.numRequest}`, 'Cerrar','warning-snackbar');
            this.fieldLabel = '';
          }
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

  existCodebars(codebars: string) : boolean {
    let result = false;
    this.gridApi.forEachNode(node => {
      if(node.data.DistNumber === codebars) result = true;
    });
    return result;
  }
  
  existItemCodeMemory(itemCode: string) : boolean {
    const val = this.memoryDocument.Detail.findIndex(val => val.ItemCode === itemCode);    
    return val !== -1 ? true : false;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  cellValidateQuantity(params: any) {
    const regexp = /^[0-9]*(?:\.\d{1,5})?$/;
    let test = regexp.test(params.newValue);
    if (test === false) {
      params.data.Quantity = Number(params.oldValue);
      return true;
    } else {
      const { Quantity: QuantityMemory } = this.memoryDocument.Detail.find(val => val.ItemCode === params.data.ItemCode);
      if(!this.sumQuantityItems(params.data.ItemCode, QuantityMemory, params)) {
        params.data.Quantity = Number(params.newValue);
        this.gridApi.applyTransaction({ update: [params.data]});
      } else {
        this.childSnak.openSnackBar(`El artículo ${params.data.ItemCode} NO puede superar ${QuantityMemory}`, 'Cerrar','warning-snackbar');
      }
      return true;
    }
  }

  sumQuantityItems(itemCode: string, QuantityMemory: number, params: any) {
    let sumQuantity = 0;
    this.gridApi.forEachNode(node => {
       if(itemCode === node.data.ItemCode && params.data.DistNumber !== node.data.DistNumber) {
          sumQuantity += Number.parseFloat(node.data.Quantity);
       }
       if(itemCode === node.data.ItemCode && params.data.DistNumber === node.data.DistNumber){
          sumQuantity += Number.parseFloat(params.newValue);
       }
    });
    //console.log(sumQuantity, QuantityMemory, (sumQuantity > QuantityMemory))
    return (sumQuantity > QuantityMemory) ? true : false;
  }
  
  onLoadDocument() {
    const { IdUser, WhsCode } = this.auth.getDataToken();
    if(!this.numRequest) { //Without id document
      this.transferService.openTransfersRequests(WhsCode).subscribe(response => {
        //Open modal
        const dialogRef = this.dialog.open(OpenRequestComponent, {
          width: 'auto',
          data: response.Data
        });
        dialogRef.afterClosed().subscribe(result => {
          if(dialogRef.componentInstance.rowSelected) {
            const { DocNum } =   dialogRef.componentInstance.rowSelected;
            this.getDocumentById(WhsCode, DocNum);
          }
        });
      }, (err) => {
        this.childSnak.openSnackBar(err.message, 'Cerrar','warning-snackbar');
      })
    } else { // With id document      
      this.getDocumentById(WhsCode, this.numRequest);
    }
  }

  async getDocumentById(WhsCode: string, DocNum: number) {
    const response = await this.transferService.getDocumentsRequests(WhsCode, DocNum).toPromise();
    if(response.Data.Document !== null) {
      this.numRequest = DocNum;
      this.memoryDocument = response.Data;
      this.childSnak.openSnackBar('Documento cargado', 'Cerrar','success-snackbar');
    } else {
      this.childSnak.openSnackBar(`No se recupero datos para el documento: ${DocNum}`, 'Cerrar','success-snackbar');
    }
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
    this.memoryDocument = new DocumentTransfer();
    this.numRequest = null;
  }
}
