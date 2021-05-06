import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DataManual, ManualToWhsCode } from 'src/app/models/transfer';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { ConfigurationService } from 'src/app/service/configuration/configuration.service';
import { ServiceLayer } from 'src/app/service/shared/ServicesLayer.service';
import { TransferService } from 'src/app/service/transfer/transfer.service';
import { SnakbarComponent } from '../../shared/snakbar/snakbar.component';
import { MultibatchComponent } from '../dialog/multibatch/multibatch.component';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent implements OnInit {
  @ViewChild(SnakbarComponent, {static: true}) childSnak: SnakbarComponent;

  private gridApi;
  private gridColumnApi;
  stayScrolledToEnd = true;

  textActions: string = '';
  loading: boolean = false;
  processRead: boolean = false;
  readManual: boolean = false;
  fieldLabel: string = '';
  fieldTowhs: ManualToWhsCode;

  columnDefs = [
    { headerName: '#', valueGetter: 'node.rowIndex + 1', resizable: false, width: 45},
    { headerName: 'Lote', field: 'DistNumber', resizable: true, width: 170 },
    { headerName: 'Cantidad', field: 'Quantity', resizable: true, width: 100, editable: true, type: 'numericColumn', valueSetter: this.cellValidateQuantity.bind(this)},
    { headerName: 'Articulo', field: 'ItemCode', resizable: true, width: 150, hide: true},
    { headerName: 'Descripción' ,field: 'ItemName', resizable: true, width: 300}
  ];

  rowData = [];

  constructor(
    private transferService: TransferService,
    private auth: AuthService,
    private configService: ConfigurationService,
    private serviceLayer: ServiceLayer,
    public dialog: MatDialog
  ) { 
    this.fieldTowhs = new ManualToWhsCode();
  }

  ngOnInit() {
    this.getListWarehouse();
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
    
    let data: DataManual;
    data = new DataManual();
    data.batchs = this.rowData;
    data.manual = this.fieldTowhs;

    const response = await this.transferService.processManual(data).toPromise().catch(err=>{
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

  readCodebars(event) {
    const { WhsCode } = this.auth.getDataToken();
    if(!this.existCodebars(event)){
      this.transferService.getBatch(event, WhsCode).subscribe(response => {
        if(response.Code === 0) {
          if(response.Data.length > 1) {
           //Open modal
            const dialogRef = this.dialog.open(MultibatchComponent, {
              width: 'auto',
              data: response.Data
            });
            dialogRef.afterClosed().subscribe(result => {
              if(dialogRef.componentInstance.rowSelected) {
                this.addRowTable(dialogRef.componentInstance.rowSelected);
              }
            });
          } else {
             this.addRowTable(response.Data[0]);
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
  addRowTable (response: any) {
    const { AbsEntryBatch, DistNumber, BinCode, AbsEntry, ItemCode, ItemName, Quantity, WhsCode, Status } = response;
    if(Status === 0){
      this.rowData.push({AbsEntryBatch: AbsEntryBatch, DistNumber: DistNumber, BinCode: BinCode, AbsEntry: AbsEntry, ItemCode: ItemCode, ItemName: ItemName, Quantity: Quantity, WhsCode: WhsCode, OriginalQuantity: Quantity });
      this.gridApi.setRowData(this.rowData);
      this.fieldLabel = '';
    } else {
      this.childSnak.openSnackBar('El lote se encuentra bloqueado', 'Cerrar','warning-snackbar');
      this.fieldLabel = '';
    }
  }

  existCodebars(codebars: string) : boolean {
    let result = false;
    this.gridApi.forEachNode(node => {
      if(node.data.DistNumber === codebars) result = true;
    });
    return result;
  }

  getListWarehouse() {
    const { WhsCode } = this.auth.getDataToken();
    this.transferService.getListWarehouse(WhsCode).subscribe(response => {
      if(response.Data.length > 0) {
        this.fieldTowhs.listWhsCode = response.Data;
        this.fieldTowhs.toWhsCode = response.Data[0].WhsCode
        this.getListWarehousePiso(this.fieldTowhs.toWhsCode);
      } else {
        this.childSnak.openSnackBar(`No se recuperaron almacenes para el usuario`, 'Cerrar','success-snackbar');
      }
    }, (err) => {
      this.childSnak.openSnackBar(err.message, 'Cerrar','warning-snackbar');
    })
  }

  getListWarehousePiso(warehouse: string) {
    this.transferService.getListWarehousePiso(warehouse).subscribe(response => {
        if(response.Data.length > 0) {
          this.fieldTowhs.listLocations = response.Data;
          this.fieldTowhs.toBinLocation = response.Data[0].AbsEntry;
        } 
        /* else {
          this.childSnak.openSnackBar(`No se recuperaron almacenes para el usuario`, 'Cerrar','success-snackbar');
        } */
    }, (err)=> {
      this.childSnak.openSnackBar(err.message, 'Cerrar','warning-snackbar');
    })
  }
  
  changeWarehouse() {
    this.getListWarehousePiso(this.fieldTowhs.toWhsCode);
  }

  cellValidateQuantity(params: any) {
    const regexp = /^[0-9]*(?:\.\d{1,5})?$/;
    let test = regexp.test(params.newValue);
    if (test === false) {
      params.data.Quantity = Number(params.oldValue);
      return true;
    } else {
      if(params.newValue > params.data.OriginalQuantity){
        this.childSnak.openSnackBar(`El lote ${params.data.DistNumber} NO puede superar la cantidad ${params.data.OriginalQuantity}`, 'Cerrar','warning-snackbar');
      } else {
        params.data.Quantity = Number(params.newValue);
        this.gridApi.applyTransaction({ update: [params.data]});
      }
      return true;
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
    this.fieldTowhs.toWhsCode = this.fieldTowhs.listWhsCode[0].WhsCode;
    this.fieldTowhs.toBinLocation = this.fieldTowhs.listLocations[0].AbsEntry
  }
}
