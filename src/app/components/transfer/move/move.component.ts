import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { batchNumbers, binLocation, transferLine, transfer } from 'src/app/models/transfer';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { ConfigurationService } from 'src/app/service/configuration/configuration.service';
import { ServiceLayer } from 'src/app/service/shared/ServicesLayer.service';
import { TransferService } from '../../../service/transfer/transfer.service';
import { SnakbarComponent } from '../../shared/snakbar/snakbar.component';
import { DialogLocationComponent } from '../dialog/dialog-location/dialog-location.component';
import { MultibatchComponent } from '../dialog/multibatch/multibatch.component';
import { SuggestedComponent } from '../dialog/suggested/suggested.component';

@Component({
  selector: 'app-move',
  templateUrl: './move.component.html',
  styleUrls: ['./move.component.css']
})
export class MoveComponent implements OnInit {
  @ViewChild(SnakbarComponent, {static: true}) childSnak: SnakbarComponent;
  rowData =[];
  private gridApi;
  private gridColumnApi;
  stayScrolledToEnd = true;

  textActions: string = '';
  loading: boolean = false;
  processRead: boolean = false;
  readManual: boolean = false;
  fieldLabel: string = '';
  fielfBincode = '';
  
  columnDefs = [
    { headerName: '#', valueGetter: 'node.rowIndex + 1', resizable: false, width: 45},
    { headerName: 'Lote', field: 'DistNumber', resizable: true, width: 170, },
    { headerName: 'AbsEntry', field: 'AbsEntry', resizable: true, width: 200, hide: true},
    { headerName: 'Ub. Ant.', field: 'BinCode', resizable: true, width: 150 },
    { headerName: 'Ub. Nueva.', field: 'NewBinCode', resizable: true, width: 150, editable: true, type: 'stringColumn', valueSetter: this.cellValidateBinLocation.bind(this)},
    { headerName: 'Articulo', field: 'ItemCode', resizable: true, width: 150, hide: true},
    { headerName: 'DescArt', field: 'ItemName', resizable: true, width: 300,}
  ];

  constructor(
    private transferService: TransferService,
    private auth: AuthService,
    private configService: ConfigurationService,
    public dialog: MatDialog,
    private serviceLayer: ServiceLayer
  ) { }

  ngOnInit() {
  }
  async onSubmit() {
    const UbEmpty = this.rowData.findIndex(val => !val.NewAbsEntry || !val.NewBinCode);
    if(UbEmpty > -1) {
      this.childSnak.openSnackBar('No puede mover lotes sin especificar ubicaciones','Cerrar','warning-snackbar');
      return
    }

    this.loading = true;
    
    const value = this.serviceLayer.sessionIsValid();
    if(!value){
        const session = await this.serviceLayer.doLoginSL().toPromise().catch(err => {
          this.childSnak.openSnackBar(err.error.error.message.value, 'Cerrar','warning-snackbar');
          this.loading = false;
          return;
        }); // return json
        if(session) {
          let documentLines: transferLine[];
          documentLines = [];
          const {IdUser, WhsCode} = this.auth.getDataToken();
          //Get serie with endpoint Configuration - API Rest
          const { Data: serie} = await  this.configService.getSerieToDocument(WhsCode).toPromise().catch( err => {
            this.childSnak.openSnackBar('No ser recupero número de serie', 'Cerrar','warning-snackbar');
          });
        
          for (let i = 0; i < this.rowData.length; i++) {
            const data = this.rowData[i];
            const BinFrom =  new binLocation(data.AbsEntry, 2, i, data.Quantity, 0); // From
            const BinTo = new binLocation(data.NewAbsEntry, 1, i, data.Quantity, 0); // To
            const Batchs = new batchNumbers(data.DistNumber, data.WhsCode, data.Quantity, i);
            const Lines = new transferLine(data.ItemCode, data.Quantity, data.WhsCode, data.WhsCode, [Batchs], [BinFrom, BinTo]);  
            documentLines.push(Lines);
          }
          const date = new Date();
          const dateDocument = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
          const hourDocument = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
          const _transfer = new transfer(dateDocument, this.rowData[0].WhsCode,this.rowData[0].WhsCode, 'HH', IdUser, documentLines, dateDocument, hourDocument, serie, '');
      
          this.transferService.createTransfer(_transfer).subscribe(result => {
            if(result.DocEntry) {
              this.childSnak.openSnackBar(`Transferencia generada: ${result.DocEntry}`,'Cerrar','success-snackbar');
              this.loading = false;
              this.onReset();
            }
          }, (err) => {
            this.childSnak.openSnackBar(`${err.error.error.message.value}`, 'Cerrar','warning-snackbar');
            this.loading = false;
          });
        }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  readCodebars(event) {
    if(!this.existCodebars(event)){
      const { WhsCode } = this.auth.getDataToken();
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
                 const { AbsEntryBatch, DistNumber, BinCode, AbsEntry, ItemCode, ItemName, Quantity, WhsCode, Status } = dialogRef.componentInstance.rowSelected;
                 this.rowData.push({AbsEntryBatch: AbsEntryBatch, DistNumber: DistNumber, BinCode: BinCode, AbsEntry: AbsEntry, ItemCode: ItemCode, ItemName: ItemName, Quantity: Quantity, WhsCode: WhsCode, NewBinCode: '', NewAbsEntry: ''  });
                 this.gridApi.setRowData(this.rowData);
                 this.fieldLabel = '';
               }
             });
           } else {
              const { AbsEntryBatch, DistNumber, BinCode, AbsEntry, ItemCode, ItemName, Quantity, WhsCode, Status } = response.Data[0];
              this.rowData.push({AbsEntryBatch: AbsEntryBatch, DistNumber: DistNumber, BinCode: BinCode, AbsEntry: AbsEntry, ItemCode: ItemCode, ItemName: ItemName, Quantity: Quantity, WhsCode: WhsCode, NewBinCode: '', NewAbsEntry: ''  });
              this.gridApi.setRowData(this.rowData);
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

  cellValidateBinLocation(params: any) {
    const { WhsCode } = this.auth.getDataToken();
    this.transferService.locationByBinCode(WhsCode, params.newValue).subscribe(response => {
      if(response.Data !== null) {
        params.data.NewAbsEntry = Number(response.Data.AbsEntry);
        params.data.NewBinCode = response.Data.BinCode;
        this.gridApi.applyTransaction({update: [params.data]});
        return true;
      } else {
        this.childSnak.openSnackBar('La ubicacion no esta habilitada o no existe', 'Cerrar','warning-snackbar');
        params.data.BinCode = params.oldValue;
        return false;
      }
    }, (err) => {
      this.childSnak.openSnackBar(err.message, 'Cerrar','warning-snackbar');
      params.data.BinCode = params.oldValue;
      return false;
    })
  }

  onClickViewLocation() {
    const { WhsCode } = this.auth.getDataToken();
    this.transferService.viewLocation(this.fielfBincode, WhsCode).subscribe(response => {
      if(response.Data.length > 0) {
        //Open Dialog
        const dialogRef = this.dialog.open(DialogLocationComponent, {
          width: 'auto',
          data: response.Data
        });
        dialogRef.afterClosed().subscribe(result => {
          this.fielfBincode = '';
        });
      }
      else {
        this.childSnak.openSnackBar(`La ubicación ${this.fielfBincode} NO existe o no tiene lotes`, 'Cerrar','warning-snackbar');
        this.fielfBincode = '';
      }
    }, (err) => {
      this.childSnak.openSnackBar(err.message, 'Cerrar','warning-snackbar');
      this.fielfBincode = '';
    });
  }
  
  async onClickSuggestedLocation() {
    let selectedNodes = this.gridApi.getSelectedRows();
    if(selectedNodes.length > 0) {
      const { WhsCode } = this.auth.getDataToken();
      const result = await this.transferService.suggestedLocation(WhsCode).toPromise();
      if(result.Data.length > 0) { //Open modal
         //Open Dialog
         const dialogRef = this.dialog.open(SuggestedComponent, {
          width: 'auto',
          data: result.Data
        });
        dialogRef.afterClosed().subscribe(result => {
          // location selected, set data in row
          const newLocation =   dialogRef.componentInstance.rowSelected;
          this.updateRowsSelected(selectedNodes, newLocation);
        });
      } else { //show message
        this.childSnak.openSnackBar(`No se recuperaron ubicaciones sugeridas`, 'Cerrar','warning-snackbar');
      }
    } else {
      this.childSnak.openSnackBar('Debe seleccionar al menos un registro', 'Cerrar','warning-snackbar');
    }
  }

  updateRowsSelected(selectedRows: any[], values: any) {
    this.rowData.map(val => {
      selectedRows.map(select => {
        if(val.DistNumber == select.DistNumber){
          val.NewBinCode = values.BinCode;
          val.NewAbsEntry = values.DftBinAbs;
        }
      });
    });
    this.gridApi.applyTransaction({ update: this.rowData});
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
  }
}
