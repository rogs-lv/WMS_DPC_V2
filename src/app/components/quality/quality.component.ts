import { Component, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { fieldAction, lineQuality } from 'src/app/models/quality';
import { warehouse } from 'src/app/models/warehouse';
import { QualityService } from 'src/app/service/quality/quality.service';
import { ServiceLayer } from 'src/app/service/shared/ServicesLayer.service';
import { SnakbarComponent } from '../shared/snakbar/snakbar.component';
import { binLocation, transfer, batchNumbers, transferLine } from '../../models/transfer';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { map } from 'rxjs/operators';
import { ConfigurationService } from 'src/app/service/configuration/configuration.service';
@Component({
  selector: 'app-quality',
  templateUrl: './quality.component.html',
  styleUrls: ['./quality.component.css']
})
export class QualityComponent implements OnInit {
  @ViewChild(SnakbarComponent, {static: true}) childSnak: SnakbarComponent;
  
  rowData =[];
  private gridApi;
  stayScrolledToEnd = true;
  
  textActions: string = '';
  loading: boolean = false;
  processRead: boolean = false;
  fieldMove: fieldAction;
  readManual: boolean = false;
  linesQuantity: lineQuality[];
  warehouses: warehouse[];
  fieldLabel: string = '';
  modelOnChange = '';

  columnDefs = [
    { headerName: '#', valueGetter: 'node.rowIndex + 1', resizable: false, width: 45},
    { headerName: 'Lote', field: 'DistNumber', resizable: true, width: 170, },
    { headerName: 'Cantidad', field: 'Quantity', resizable: true, width: 100, },
    { headerName: 'Descripcion', field: 'ItemName', resizable: true, width: 270,}
  ];
  
  
  constructor(
    private qualityService: QualityService,
    private serviceLayer: ServiceLayer,
    private configService: ConfigurationService,
    private auth: AuthService
  ) { 
    this.fieldMove = new fieldAction;
    this.linesQuantity = [];
    this.warehouses = [];
  }

  ngOnInit() {
  }
  
  onGridReady(params) {
    this.gridApi = params.api;
  }

  getWarehouse() {
    if(this.warehouses.length === 0) {
      this.qualityService.getWarehouseQuality().subscribe(response => {
        if(response.Code === 0) {
          this.warehouses = response.Data;
        }
      }, (err) => {
        this.childSnak.openSnackBar(err.message, 'Cerrar','error-snackbar');
      });
    }
  }

  readCodebars(event) {
    if(event !== null && event !== '') {
      let existBatch = this.existCodebars(event)
      if(existBatch === false) {
        this.qualityService.getBatch(event, this.statusModule()).subscribe(response => {
          if(response.Code === 0) {
            const {AbsEntryBatch, DistNumber, BinCode, AbsEntry, ItemCode, ItemName, Quantity, WhsCode, Status } = response.Data[0];
            this.rowData.push({AbsEntryBatch: AbsEntryBatch, DistNumber: DistNumber, BinCode: BinCode, AbsEntry: AbsEntry, ItemCode: ItemCode, ItemName: ItemName, Quantity: Quantity, WhsCode: WhsCode, Status: Status });
            this.gridApi.setRowData(this.rowData);
            this.fieldLabel = '';
          } else {
            this.childSnak.openSnackBar(response.Message, 'Cerrar','warning-snackbar');
            this.fieldLabel = '';
          }
        }, (err) => {
            this.childSnak.openSnackBar(err.message, 'Cerrar','warning-snackbar');
            this.fieldLabel = '';
        });
      } else {
        // If set value '' execute very fast, not restart/reset value in HTML, review documentation
        setTimeout( () => {
          this.childSnak.openSnackBar('El lote ya fue leído', 'Cerrar','warning-snackbar');
          this.fieldLabel = '';
        }, 100);
      }
    }
  }

  handleRowDataChanged(event) {
    const index = this.rowData.length - 1;
    if (this.stayScrolledToEnd) {
      this.gridApi.ensureIndexVisible(index, 'bottom');
    }
  }
  
  statusModule(): number {
    let resultStatus = -2;
    if(this.fieldMove.Locked && !this.fieldMove.Unlocked) {
      resultStatus = 2
    } else if (this.fieldMove.Unlocked && !this.fieldMove.Locked) {
      resultStatus = 0;
    }
    return resultStatus;
  }

   // delete rows
   onRemoveSelected() {
    const selectedData = this.gridApi.getSelectedRows();

    let temp = this.rowData.filter((element) => {
      return selectedData.indexOf(element) < 0;
    });

    this.rowData = temp;
    this.gridApi.applyTransaction({ remove: selectedData });
    this.gridApi.applyTransaction({ update: this.rowData});

  }

  existCodebars(codebars: string) : boolean {
    let result = false;
    this.gridApi.forEachNode(node => {
      if(node.data.DistNumber === codebars) result = true;
    });
    return result;
  }

  async onSubmit() {
    this.loading = true;
    const value = this.serviceLayer.sessionIsValid();
    if(!value){
        const session = await this.serviceLayer.doLoginSL().toPromise(); // return json
    }

    if(this.isOnlyLocked()) { // Only locked batchs
      this.onLockedOrRelease("bdsStatus_Locked").then(locked => {
        if(locked > 0) {
          this.childSnak.openSnackBar(`Lotes bloqueados: ${locked}`, 'Cerrar','success-snackbar');
          this.onRestart();
          this.loading = false;
        } else {
          this.childSnak.openSnackBar(`No se pudieron actualizar todos los lotes`, 'Cerrar','warning-snackbar');
          this.loading = false;
        }
        /* this.logOutSL(); */
      }).catch(err => {
        this.childSnak.openSnackBar(`${err.error.error.message.value}`, 'Cerrar','warning-snackbar');
        this.loading = false;
      });
    } else if (this.isOnlyRelease()) { // Only release (unlocked) batchs
      this.onLockedOrRelease("bdsStatus_Released").then(release => {
        if(release > 0){
          this.childSnak.openSnackBar(`Lotes desbloqueados: ${release}`, 'Cerrar','success-snackbar');
          this.onRestart();
          this.loading = false;
        } else {
          this.childSnak.openSnackBar(`No se pudieron actualizar todos los lotes`, 'Cerrar','warning-snackbar');
          this.loading = false;
        }
        /* this.logOutSL(); */
      }).catch(err => {
        this.childSnak.openSnackBar(`${err.error.error.message.value}`, 'Cerrar','warning-snackbar');
        this.loading = false;
      });
    } else if (this.areBothMovements()) { // Both movements (locked and movement)
      this.onMovementLocked();
    }
  }

  async onLockedOrRelease(newStatus: string) {
    let rowsUpd = 0;
    for(let i = 0; i < this.rowData.length; i++) {
      await this.qualityService.doReleaseOrLocked(this.rowData[i].AbsEntryBatch, newStatus).toPromise()
      rowsUpd++;
    }
    return rowsUpd;
  }

  /* logOutSL() {
    this.serviceLayer.doLogoutSL().toPromise().then(result => {
      this.serviceLayer.deleteSession();
    }).catch( err => {
      console.error(err);
    })
  } */
  //First move, after locked
  async onMovementLocked() {
    let documentLines: transferLine[];
    documentLines = [];
    const {IdUser, WhsCode} = this.auth.getDataToken();
    //Get serie with endpoint Configuration - API Rest
    const { Data: serie} = await  this.configService.getSerieToDocument(WhsCode).toPromise().catch( err => {
      this.childSnak.openSnackBar('No ser recupero número de serie', 'Cerrar','error-snackbar');
    });
    //Get AbsEntry of Warehouse for bin location, otherwise not add location
    const { Data: defaultBin} = await this.qualityService.getDefaultLocation(this.fieldMove.WhsCode).toPromise().catch( err => {
      this.childSnak.openSnackBar('No ser recupero ubicación destino', 'Cerrar','error-snackbar');
    });
    
    for (let i = 0; i < this.rowData.length; i++) {
      const data = this.rowData[i];
      const BinFrom =  new binLocation(data.AbsEntry, 2, i, data.Quantity, 0);
      let BinTo;
      if(defaultBin.DftBinAbs > 0)
        BinTo = new binLocation(defaultBin.DftBinAbs, 1, i, data.Quantity, 0);
      const Batchs = new batchNumbers(data.DistNumber, data.WhsCode, data.Quantity, i);
      let Lines;
      if(defaultBin.DftBinAbs > 0)
        Lines = new transferLine(data.ItemCode, data.Quantity, this.fieldMove.WhsCode, data.WhsCode, [Batchs], [BinFrom, BinTo]);
      else
        Lines = new transferLine(data.ItemCode, data.Quantity, this.fieldMove.WhsCode, data.WhsCode, [Batchs], [BinFrom]);

      documentLines.push(Lines);
    }
    const date = new Date();
    const dateDocument = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
    const hourDocument = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    let document = new transfer(dateDocument, this.rowData[0].WhsCode, this.fieldMove.WhsCode, 'HH', IdUser, documentLines, dateDocument, hourDocument, serie);
    //console.log(document);
    this.qualityService.doTransfer(document).toPromise().then(result => {
      //console.log(result)
      if(result.DocEntry) {
        this.onLockedOrRelease("bdsStatus_Locked").then(locked => {
          if(locked > 0) {
            this.onRestart();
            this.loading = false;
          } else {
            this.loading = false;
          }
        }).catch(err => {
          this.childSnak.openSnackBar(`${err.error.error.message.value}`, 'Cerrar','warning-snackbar');
          this.loading = false;
        });
      }
    }).catch(err => {
      this.childSnak.openSnackBar(`${err.error.error.message.value}`, 'Cerrar','warning-snackbar');
    });
  }

  isOnlyLocked() : boolean {
    if(this.fieldMove.Locked && !this.fieldMove.Unlocked && !this.fieldMove.Move)
      return true;
  }

  isOnlyRelease(): boolean {
    if(!this.fieldMove.Locked && this.fieldMove.Unlocked && !this.fieldMove.Move)
      return true;
  }

  areBothMovements() {
    if (this.fieldMove.Locked && !this.fieldMove.Unlocked && this.fieldMove.Move)
      return true;
  }

  onClickReadManual() {
    this.fieldLabel = '';
    !this.readManual ? this.readManual = true : this.readManual = false;
  }

  addLabelManual() {
    this.readCodebars(this.fieldLabel);
  }

  onProcessRead() {
    this.processRead = true;
  }
  // Clear table
  onCancelProcessRead() {
    this.processRead = false;
    this.gridApi.setRowData([]);
    this.rowData = [];
    this.fieldMove = new fieldAction;
  }

  onRestart() {
    this.rowData = [];
    this.gridApi.setRowData([]);
  }

  textLocked() {
    this.fieldMove.Locked ? this.textActions = 'Bloqueo' : this.textActions = this.textActions.replace('Bloqueo','');
    this.fieldMove.Unlocked = false;
  }

  textUnlocked() {
    this.fieldMove.Unlocked ? this.textActions = 'Desbloqueo' : this.textActions = this.textActions.replace('Desbloqueo','');
    this.fieldMove.Locked = false;
    this.fieldMove.Move = false;
  }

  textMove() {
    (this.fieldMove.Move) ? this.textActions += ' y Movimiento' : this.textActions = this.textActions.replace('y Movimiento','');
  }
}
