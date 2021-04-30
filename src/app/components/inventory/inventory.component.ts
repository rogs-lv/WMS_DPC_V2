import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BatchInLocation } from 'src/app/models/batch';
import { inventory, typeRead } from 'src/app/models/inventory';
import { warehouse, WarehouseLocation } from 'src/app/models/warehouse';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { InventoryService } from 'src/app/service/inventory/inventory.service';
import { SnakbarComponent } from '../shared/snakbar/snakbar.component';
import { LocationBatchComponent } from './dialog/location-batch/location-batch.component';
import { DialogConfirmComponent } from '../shared/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
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
  inventoryField: inventory;
  radioFlag: any;
  columnDefs = [
    { headerName: '#', valueGetter: 'node.rowIndex + 1', resizable: false, width: 45},
    { headerName: 'Lote', field: 'DistNumber', resizable: true, width: 170, },
    { headerName: 'Ctd. SAP', field: 'Quantity', resizable: true, width: 100 },
    { headerName: 'Ctd. Ctda', field: 'CtdCtda', resizable: true, width: 100, editable: true, type: 'numericColumn', valueSetter: this.cellValidateCtdCtda.bind(this)},
    { headerName: 'AbsEntry', field: 'AbsEntry', resizable: true, width: 200, hide: true},
    { headerName: 'Ubicación', field: 'BinCode', resizable: true, width: 150, editable: true, type: 'stringColumn', valueSetter: this.cellValidateBinLocation.bind(this)},
    { headerName: 'Articulo', field: 'ItemCode', resizable: true, width: 150, },
    { headerName: 'Almacen', field: 'WhsCode', resizable: true, width: 150,},
    { headerName: 'DescArt', field: 'ItemName', resizable: true, width: 300,}
  ];
  arrayNumsCount = [];
  listWarehouse: warehouse[];
  locationWhsSelect: WarehouseLocation;
  locationRec: string = '';
  oldValue = '';
  constructor(
    private auth: AuthService,
    private serviceInventory: InventoryService,
    public dialog: MatDialog
  ) { 
    this.inventoryField = new inventory();
    this.locationWhsSelect = new WarehouseLocation();
    this.listWarehouse = [];
    this.radioFlag = 'B';
  }

  ngOnInit() {
    this.inventoryField.numRecount = 1;
    this.countNumbers();
    this.warehouses();    
  }
  
  async onSubmit(){
    this.loading = true;
    let stringValues = [];
    const date = new Date();
    const dateFile = `${date.getFullYear()}${("0" + (date.getMonth() + 1)).slice(-2)}${("0" + date.getDate()).slice(-2)}`;
    const { IdUser } = this.auth.getDataToken();
    const fileName = `${this.inventoryField.WhsCode}_${IdUser}__R${this.inventoryField.numRecount}_${dateFile}.txt`; 

    this.gridApi.forEachNode(node => {
      const value = node.data;
      stringValues.push(`${value.DistNumber}\t${value.CtdCtda}\t${value.BinCode}\t${value.ItemCode}\t${value.WhsCode}\t${value.ItemName}`);
    });

    const existFile = await this.serviceInventory.getCheckInventoryFile(this.inventoryField.WhsCode, fileName, IdUser).toPromise();
    if(existFile.Data) {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        width: '250px',
      });
      dialogRef.afterClosed().subscribe(result => {
        if(dialogRef.componentInstance.closeMessage == "Yes"){
          this.serviceInventory.createInventoryFile(this.inventoryField.WhsCode, IdUser, fileName, stringValues).subscribe(response => {
            if(response.Data){
              this.childSnak.openSnackBar(`${response.Message}`, 'Cerrar','success-snackbar');
              this.loading = false;
              this.onResetInventory();
            }
          },(err) => {
            this.childSnak.openSnackBar(err.message, 'Cerrar','error-snackbar');
            this.loading = false;
          });
        } else {
          this.loading = false;
        }
      });    
    } else {
      const resultCreate = await this.serviceInventory.createInventoryFile(this.inventoryField.WhsCode, IdUser, fileName, stringValues).toPromise();
      if(resultCreate.Data) {
        this.childSnak.openSnackBar(`${resultCreate.Message}`, 'Cerrar','success-snackbar');
        this.loading = false;
        this.onResetInventory();
      } else {
        this.childSnak.openSnackBar(resultCreate.Message, 'Cerrar','error-snackbar');
        this.loading = false;
      }
    }
  }

  onResetInventory() {
    this.gridApi.setRowData([]);
    this.rowData = [];
    this.locationRec = '';
    this.radioFlag = 'B';
    this.inventoryField.numRecount = 1;
    this.inventoryField.WhsCode = null;
  }
  
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.accessColumnSAP();
  }

  // read and process label
  readCodebars(event) {
    switch (this.radioFlag) {
      case "B": //Batch
        if(!this.existCodebars(event)){
          this.serviceInventory.getBatch(this.fieldLabel, this.inventoryField.WhsCode).subscribe(response => {
            if(response.Code === 0) {
              const { AbsEntryBatch, DistNumber, BinCode, AbsEntry, ItemCode, ItemName, Quantity, WhsCode, Status } = response.Data[0];
              this.rowData.push({AbsEntryBatch: AbsEntryBatch, DistNumber: DistNumber, BinCode: BinCode, AbsEntry: AbsEntry, ItemCode: ItemCode, ItemName: ItemName, Quantity: Quantity, CtdCtda:0, WhsCode: WhsCode, Status: Status });
              this.gridApi.setRowData(this.rowData);
              this.fieldLabel = '';
            } else {
              this.childSnak.openSnackBar(response.Message, 'Cerrar','warning-snackbar');
              this.fieldLabel = '';
            }
          }, (err) => {
              this.childSnak.openSnackBar(err.message, 'Cerrar','warning-snackbar');
              this.fieldLabel = '';
          })
        } else {
          setTimeout( () => {
            this.childSnak.openSnackBar('El lote ya fue leído', 'Cerrar','warning-snackbar');
            this.fieldLabel = '';
          }, 100);
        }
        break;
      case "L": //Location
        this.serviceInventory.getLocationsWhsInventory(this.inventoryField.WhsCode).subscribe(response => {
          if(response.Data.DftBinEnfd === "Y"){
            this.serviceInventory.getSeeLocation(this.fieldLabel, this.inventoryField.WhsCode).subscribe(batchs => {
                if(batchs.Data.length > 0) {
                  const findBatchs = [];
                  batchs.Data.map(batch => {
                    if(!this.existCodebars(batch.DistNumber)) {
                      Object.assign(batch, {"CtdCtda": 0});
                      findBatchs.push(batch);
                    }
                  });
                  Array.prototype.push.apply(this.rowData, findBatchs);
                  this.gridApi.setRowData(this.rowData);
                  this.fieldLabel = '';
                } else {
                  setTimeout(() => {
                    this.childSnak.openSnackBar(`No se encontraron lotes en la ubicación ${this.fieldLabel}`, 'Cerrar','warning-snackbar');
                    this.fieldLabel = '';
                  }, 100);
                }
            }, (err) => {
              this.childSnak.openSnackBar(err.message, 'Cerrar','warning-snackbar');
              this.fieldLabel = '';
            });
          } else {
            setTimeout(() => {
              this.childSnak.openSnackBar('El almacén no maneja ubicaciones', 'Cerrar','warning-snackbar');
              this.fieldLabel = '';
            }, 100);
          }
        }, (err) => {
          this.childSnak.openSnackBar(err.message, 'Cerrar','warning-snackbar');
          this.fieldLabel = '';
        });
        break;
      default:
        setTimeout(() => {
          this.childSnak.openSnackBar('Debe seleccionar un tipo de lectura', 'Cerrar','warning-snackbar');
          this.fieldLabel = '';  
        }, 100);
        break;
    }
  }

  onChangeWarehouse(previousValue: any, warehouse: any, statesEl: HTMLSelectElement) {
    if(this.rowData.length > 0) {
      if (previousValue === null) {
        this.inventoryField.WhsCode = warehouse;
        return;
      }
      // Otherwise we want the user to confirm that change
      if (confirm('Si cambia el almacén, se perderán todos los datos. ¿Desea continuar?')) {
        this.inventoryField.WhsCode = warehouse;
        this.rowData = [];
        this.gridApi.setRowData([]);
      } else {
        statesEl.selectedIndex = this.listWarehouse.findIndex(val => val.WhsCode === previousValue) + 1;
      }
    } else {
      this.inventoryField.WhsCode = warehouse;
    }
  }

  async accessColumnSAP() {
    const { IdUser } = this.auth.getDataToken();
    const accessColumn = await this.serviceInventory.getAccessColumnQtySAP(IdUser).toPromise();
    this.gridColumnApi.setColumnsVisible(["Quantity"], accessColumn.Data);
  }

  existCodebars(codebars: string) : boolean {
    let result = false;
    this.gridApi.forEachNode(node => {
      if(node.data.DistNumber === codebars) result = true;
    });
    return result;
  }

  // validación de celda cantidad contada
  cellValidateCtdCtda(params: any) {
    const regexp = /^[0-9]*(?:\.\d{1,5})?$/;
    let test = regexp.test(params.newValue);
    if (test === false) {
      params.data.CtdCtda = Number(params.oldValue);
      return true;
    } else {
      params.data.CtdCtda = Number(params.newValue);
      this.gridApi.applyTransaction({ update: [params.data]});
      return true;
    }
  }

  cellValidateBinLocation(params: any) {
    this.serviceInventory.getAbsEntryUsingBinCode(this.inventoryField.WhsCode, params.newValue, '').subscribe(response => {
      if(response.Data !== null) {
        params.data.AbsEntry = Number(response.Data.AbsEntry);
        params.data.BinCode = response.Data.BinCode;
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

  countNumbers() {
    const { WhsCode } = this.auth.getDataToken();
    this.serviceInventory.getNumbersRecounts(WhsCode).subscribe(response =>{
      for(let i = 1; i <= response.Data; i++) {
        this.arrayNumsCount.push(i);
      }
    }, (err) => {
      this.childSnak.openSnackBar('Error al obtener los numeros de recuento', 'Cerrar','warning-snackbar');
    });
  }

  warehouses() {
    const { WhsCode } = this.auth.getDataToken();
    this.serviceInventory.getListWarehouseInventory(WhsCode, "2").subscribe(response => {
      this.listWarehouse = response.Data;
      this.inventoryField.WhsCode = null;//this.listWarehouse[0].WhsCode;
    }, (err) => {
      this.childSnak.openSnackBar('Error al obtener los almacenes', 'Cerrar','warning-snackbar');
    })
  }

  AbsEntryWhs() {
    if(this.inventoryField.WhsCode){
      this.serviceInventory.getLocationsWhsInventory(this.inventoryField.WhsCode).subscribe(response => {
        if(response.Data.DftBinEnfd === "Y"){
          this.locationWhsSelect = response.Data;
        } else {
          this.childSnak.openSnackBar(`El almacén ${this.inventoryField.WhsCode} NO maneja ubicaciones`, 'Cerrar','warning-snackbar');  
        }
      }, (err) => {
        this.childSnak.openSnackBar('Error al obtener la ubición del almacén', 'Cerrar','warning-snackbar');
      });
    }
  }

  viewLocations() {
    this.serviceInventory.getSeeLocation(this.locationRec, this.inventoryField.WhsCode).subscribe(response => {
      if(response.Data.length > 0) {
        //Open Dialog
        const dialogRef = this.dialog.open(LocationBatchComponent, {
          width: 'auto',
          data: response.Data
        });
        dialogRef.afterClosed().subscribe(result => {
          //array of lotes
          this.buildDataTable(result);
          this.locationRec = '';
        });
      }
      else {
        this.childSnak.openSnackBar(`La ubicación ${this.locationRec} NO existe`, 'Cerrar','warning-snackbar');
        this.locationRec = '';
      }
    }, (err) => {
      this.childSnak.openSnackBar(err.message, 'Cerrar','warning-snackbar');
      this.locationRec = '';
    });
  }

  buildDataTable(data: BatchInLocation[]) {
    const ArrayBatch = [];
    for(let i = 0; i < data.length; i++){
      /* if(!this.existCodebars(data[i].DistNumber) && !this.binLocationbatch(data[i].BinCode)){ */
      if(!this.existCodebars(data[i].DistNumber)) {
        Object.assign(data[i], {"CtdCtda": 0});
        ArrayBatch.push(data[i])
      }
    }
    Array.prototype.push.apply(this.rowData, ArrayBatch);
    this.gridApi.setRowData(this.rowData);
  }
  
  binLocationbatch(location:string){
    let result = false;
    this.gridApi.forEachNode(node => {
      if(node.data.BinCode === location) result = true;
    });
    return result;

  }

  clearLocation() {
    this.locationRec = '';
  }

  handleRowDataChanged(event) {
    const index = this.rowData.length - 1;
    if (this.stayScrolledToEnd) {
      this.gridApi.ensureIndexVisible(index, 'bottom');
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
}
