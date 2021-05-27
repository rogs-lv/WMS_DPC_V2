import { Component, OnInit, ViewChild } from '@angular/core';
import { BusnessPartner, shippingDocument } from 'src/app/models/shipping';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { ConfigurationService } from 'src/app/service/configuration/configuration.service';
import { ServiceLayer } from 'src/app/service/shared/ServicesLayer.service';
import { ShippingService } from 'src/app/service/shipping/shipping.service';
import { SnakbarComponent } from '../shared/snakbar/snakbar.component';
import { shippingLines } from '../../models/shipping';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css']
})
export class ShippingComponent implements OnInit {
  @ViewChild(SnakbarComponent, {static: true}) childSnak: SnakbarComponent;

  private gridApi;
  private gridColumnApi;
  stayScrolledToEnd = true;

  textActions: string = '';
  loading: boolean = false;
  processRead: boolean = false;
  readManual: boolean = false;
  fieldLabel: string = '';
  client: BusnessPartner;

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
    private configService: ConfigurationService,
    private serviceLayer: ServiceLayer,
    private serviceShipping: ShippingService
  ) { 
    this.client = new BusnessPartner();
  }

  ngOnInit() {
    this.getListPartners();
  }

  async onSubmit() {
    this.loading = true;
    let linesDocument: shippingLines[];
    linesDocument = [];
    const date = new Date();
    const dateDocument = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
    const hourDocument = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const {IdUser, WhsCode} = this.auth.getDataToken();

    this.rowData.map(val => {
      //const shippingLines = { "ItemCode": val.ItemCode, "Quantity": val.Quantity, "WarehouseCode": "EMBARQUE", "FromWarehouseCode": val.WhsCode, "U_LoteSAP": val.DistNumber, "U_Location": val.BindCode };
      linesDocument.push(new shippingLines(val.ItemCode, val.Quantity, 'EMBARQUE', val.WhsCode, val.DistNumber, val.BinCode));
    })

    const sortLines = linesDocument.sort(function (a, b) {
      var nameA = a.ItemCode.toUpperCase(); // ignore upper and lowercase
      var nameB = b.ItemCode.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
          return -1;
      }
      if (nameA > nameB) {
          return 1;
      }
      // names must be equal
      return 0;
    });
    //const document = { Series: serie, DocDate: dateEncabezado, CardCode: CC, FromWarehouse: datosLote[0].WhsCod, U_OrigenMov: "HH", U_UsrHH: usr, ToWarehouse: "EMBARQUE", U_Destino: "EMBARQUE", StockTransferLines: newSortJson };   
    const { Data: serie} = await  this.configService.getSerieToDocument(WhsCode).toPromise().catch( err => {
      this.childSnak.openSnackBar('No ser recupero número de serie', 'Cerrar','error-snackbar');
    });
    
    let document = new shippingDocument(dateDocument, this.rowData[0].WhsCode, 'EMBARQUE', 'HH', IdUser, sortLines, dateDocument, hourDocument, undefined, 'EMBARQUE', this.client.partner);
    
    const value = this.serviceLayer.sessionIsValid();
    if(!value){
        const session = await this.serviceLayer.doLoginSL().toPromise().catch(err => {
          this.childSnak.openSnackBar(err.error.error.message.value, 'Cerrar','warning-snackbar');
          this.loading = false;
          return;
        }); // return json
        if(session) {
          this.serviceShipping.createInventoryTransferRequest(document).subscribe(result => {
            if(result.DocEntry) {
              this.updateStFolio();
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
  }

  async updateStFolio() {
    await this.rowData.map(val => {
      this.serviceShipping.change_stFolio(val.AbsEntryBatch, 'R').toPromise();
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  readCodebars(event) {
    const { WhsCode } = this.auth.getDataToken();
    if(!this.existCodebars(event)){
      this.serviceShipping.getBatch(event, WhsCode).subscribe(response => {
        if(response.Code === 0) {
          this.addRowTable(response.Data[0]);
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
    const { AbsEntryBatch, DistNumber, BinCode, AbsEntry, ItemCode, ItemName, Quantity, WhsCode, Status, U_stFolio, ItmsGrpCod } = response;
    if(Status === 0){
      if(U_stFolio === 'R') {
        this.childSnak.openSnackBar('El lote ya fue Remisionado', 'Cerrar','warning-snackbar');
        this.fieldLabel = '';
        return;
      } 
      
      if(U_stFolio !== 'N') {
        this.childSnak.openSnackBar('El lote NO tiene el estatus de Notificado', 'Cerrar','warning-snackbar');
        this.fieldLabel = '';
        return;
      } 
     
      const { U_GrpItems: groupItem} = this.client.listPartner.find(val => val.CardCode === this.client.partner );
      if(groupItem !== ItmsGrpCod){
        this.childSnak.openSnackBar('El lote NO pertenece al mismo grupo de Artículos', 'Cerrar','warning-snackbar');
        this.fieldLabel = '';
        return;
      }

      this.rowData.push({AbsEntryBatch: AbsEntryBatch, DistNumber: DistNumber, BinCode: BinCode, AbsEntry: AbsEntry, ItemCode: ItemCode, ItemName: ItemName, Quantity: Quantity, WhsCode: WhsCode, ItmsGrpCod: ItmsGrpCod, U_stFolio: U_stFolio });
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

  getListPartners() {
    this.serviceShipping.getPartners().subscribe(response => {
      this.client.listPartner = response.Data;
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
    this.client.partner = null;
  }
}
