import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { SnakbarComponent } from '../shared/snakbar/snakbar.component';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { FolioService } from 'src/app/service/folio/folio.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../shared/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-folio',
  templateUrl: './folio.component.html',
  styleUrls: ['./folio.component.css']
})
export class FolioComponent implements OnInit {
  @ViewChild(SnakbarComponent, {static: true}) childSnak: SnakbarComponent;
  
  rowData =[];
  private gridApi;
  stayScrolledToEnd = true;

  textActions: string = '';
  loading: boolean = false;
  processRead: boolean = false;
  readManual: boolean = false;
  fieldLabel: string = '';
  modelOnChange = '';
  rackArray = [{Value: "1", Text: "1"}, {Value: "2", Text: "2"},{Value: "3", Text: "3"} ,{Value: "4", Text: "4"} ,{Value: "5", Text: "5"}, {Value: "6", Text: "6"},{Value: "7", Text: "7"}];
  rack = "";

  columnDefs = [
    { headerName: '#', valueGetter: 'node.rowIndex + 1', resizable: false, width: 45},
    { headerName: 'Folios SAP', field: 'DistNumber', resizable: true, width: 170, },
  ];

  constructor(
    private auth: AuthService,
    private folioService: FolioService,
    public dialog: MatDialog
  ) { 
    this.rack = "1";
  }

  ngOnInit() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  onSubmit() {
    this.createFolioFile();
  }
  // read and process label
  readCodebars(event) {
    if(!this.existCodebars(event)){
      setTimeout(() => {
        this.rowData.push({DistNumber: event});
        this.gridApi.setRowData(this.rowData);
        this.fieldLabel = '';
      }, 100);
    } else {
      setTimeout( () => {
        this.childSnak.openSnackBar('El lote ya fue leído', 'Cerrar','warning-snackbar');
        this.fieldLabel = '';
      },100);
    }
  }

  existCodebars(codebars: string) : boolean {
    let result = false;
    this.gridApi.forEachNode(node => {
      if(node.data.DistNumber === codebars) result = true;
    });
    return result;
  }

  async createFolioFile() {
    this.loading = true;
    const date = new Date();
    const arrayBatchs = [];
    const dateFile = `${date.getFullYear()}${("0" + (date.getMonth() + 1)).slice(-2)}${("0" + date.getDate()).slice(-2)}`;
    const {IdUser } = this.auth.getDataToken();

    const fileName = `Folios_${IdUser}__Rack${this.rack}_${dateFile}.txt`;
    this.gridApi.forEachNode(node => {
      arrayBatchs.push(node.data.DistNumber);
    });
    const existFile = await this.folioService.getCheckFolioFile(fileName, IdUser).toPromise();
    
    if(existFile.Data) {
        const dialogRef = this.dialog.open(DialogConfirmComponent, {
          width: '250px',
        });
        dialogRef.afterClosed().subscribe(result => {
          if(dialogRef.componentInstance.closeMessage == "Yes"){
            this.folioService.saveFileFolio(fileName, IdUser, arrayBatchs).subscribe(response => {
              if(response.Data){
                this.childSnak.openSnackBar(`${response.Message}`, 'Cerrar','success-snackbar');
                this.loading = false;
                this.onResetFolio();
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
      const resultCreate = await this.folioService.saveFileFolio(fileName, IdUser, arrayBatchs).toPromise();
      if(resultCreate.Data) {
        this.childSnak.openSnackBar(`${resultCreate.Message}`, 'Cerrar','success-snackbar');
        this.loading = false;
        this.onResetFolio();
      } else {
        this.childSnak.openSnackBar(resultCreate.Message, 'Cerrar','error-snackbar');
        this.loading = false;
      }
    }
  }
  
  onResetFolio() {
    this.gridApi.setRowData([]);
    this.rowData = [];
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
  
  handleRowDataChanged(event) {
    const index = this.rowData.length - 1;
    if (this.stayScrolledToEnd) {
      this.gridApi.ensureIndexVisible(index, 'bottom');
    }
  }
}