import { Component, OnInit, ViewChild } from '@angular/core';
import { documentship, shipmentProcess, shipmentSAP } from 'src/app/models/shipment';
import { BusnessPartner, shippingDocument, shippingLines } from 'src/app/models/shipping';
import { AuthService } from 'src/app/service/authentication/auth.service';
import { ConfigurationService } from 'src/app/service/configuration/configuration.service';
import { ServiceLayer } from 'src/app/service/shared/ServicesLayer.service';
import { ShipmentService } from 'src/app/service/shipment/shipment.service';
import { SnakbarComponent } from '../shared/snakbar/snakbar.component';
import { batch } from '../../models/batch';
import { ShippingService } from 'src/app/service/shipping/shipping.service';
import { map } from 'rxjs/operators';
import { transferShipment } from 'src/app/models/transfer';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.css']
})
export class ShipmentComponent implements OnInit {
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
  numShipment = null;
  memoryDocument: documentship[];
  isEFEEM = false;
  
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
    private shipmentService: ShipmentService,
    private serviceShipping: ShippingService
  ) { 
    this.client = new BusnessPartner();
    this.memoryDocument = [];
  }

  ngOnInit() {
    this.getListPartners();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  async onSubmit() {
    this.loading = true;
    this.loading = false;
    if(!this.isEFEEM) { // NOT EFFEM
      this.buildDocumentNotEFFEM();
    } else { // EFFEM
      this.buildDocumentEFFEM();
    }
  }

  async buildDocumentNotEFFEM() {
    this.loading = true;
    let linesDocument: shippingLines[];
    linesDocument = [];
    const date = new Date();
    const dateDocument = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
    const hourDocument = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const {IdUser, WhsCode} = this.auth.getDataToken();
    
    this.rowData.map(val => {
      linesDocument.push(new shippingLines(val.ItemCode, val.Quantity, 'EMBARQUE', val.WhsCode, val.DistNumber, undefined));
    });

    let document = new shippingDocument(dateDocument, this.rowData[0].WhsCode, 'EMBARQUE', 'HH', IdUser, linesDocument, dateDocument, hourDocument, undefined, 'EMBARQUE', this.client.partner);
    const value = this.serviceLayer.sessionIsValid();
    if(!value){
        const session = await this.serviceLayer.doLoginSL().toPromise(); // return json
    }
    
    this.shipmentService.createRequestShipment(document).subscribe(result => {
      if(result.DocEntry) {
        this.updateStFolio('R', result.DocEntry, result.DocNum);
        this.childSnak.openSnackBar(`Documento generada: ${result.DocNum}`,'Cerrar','success-snackbar');
        this.loading = false;
        this.onReset();
      }
    }, (err) => {
      this.childSnak.openSnackBar(`${err.error.error.message.value}`, 'Cerrar','warning-snackbar');
      this.loading = false;
    });
  }

  async buildDocumentEFFEM() {
    this.loading = true;
    const {IdUser, WhsCode} = this.auth.getDataToken();
    
    let data: shipmentProcess[];
    data = [];
    data = this.rowData;
    const response = await this.shipmentService.processShipmentEFFEM(data).toPromise().catch(err=>{
      this.childSnak.openSnackBar(`Error al procesar los datos ${err.message}`, 'Cerrar','warning-snackbar');
      this.loading = false;
    });   
    
    if(response.Data !== null) {
      const value = this.serviceLayer.sessionIsValid();
      if(!value){
          const session = await this.serviceLayer.doLoginSL().toPromise(); // return json
      }

      if(response.Data.length > 0) {

        let documentsCreated = [];
        documentsCreated.push(await Promise.all(response.Data.map(async (transferShipment) => {
          let documentsSAP: any;
          transferShipment.Series = undefined;
          transferShipment.U_UsrHH = IdUser;
          const result = await this.shipmentService.createTransfer(transferShipment).toPromise();
          if(result != null){
            if(result.DocEntry){
              documentsSAP = new shipmentSAP(result.DocEntry, result.DocNum);
              this.updateShipmentEFFEM(transferShipment.StockTransferLines, 'E', result.DocEntry, result.DocNum);
            } else {
              documentsSAP = new shipmentSAP(-1,-1, result.error.message.value);
            }
          }
          return documentsSAP;
        })));
        
        //this.childSnak.openSnackBar(`Generados: ${documentsCreated[0].filter(val => val.DocEntry > 0).map(m => m.DocEntry).join(', ')}  NO Generados: ${documentsCreated[0].filter(val => val.DocEntry === -1).map(m => m.Error).join(', ')}`,'Cerrar','blue-snackbar');
        this.childSnak.openSnackBar(`Generados: ${documentsCreated[0].filter(val => val.DocEntry > 0).map(m => m.DocEntry).join(', ')}`,'Cerrar','success-snackbar')
        this.onReset();
        this.loading = false;
      } else {
        this.childSnak.openSnackBar(`No hay documentos para integrar`,'Cerrar','warning-snackbar');
        this.loading = false;
      }      
    } else {
      this.childSnak.openSnackBar(`Se genero un error al momento de construir los documentos`,'Cerrar','warning-snackbar');
      this.loading = false;
    }
  }

  async updateStFolio(status: string, docEntry: number, DocNum: number) {
    let listBatchs = [];
    this.rowData.map(val => {
        listBatchs.push(val.DistNumber);
    });
    await this.shipmentService.updateBatchs(listBatchs, status, DocNum, docEntry).toPromise();
  }

  async updateShipmentEFFEM(batchs: any[], status: string, docEntry: number, DocNum: number){
    let listBatchs = [];
    batchs.map(val => {
      val.BatchNumbers.map(b => {
        listBatchs.push(b.BatchNumber)
      })
    })
    await this.shipmentService.updateBatchs(listBatchs, status, DocNum, docEntry).toPromise();
  }

  async readCodebars(event){
    const applyGR =  await this.applyGR(event);
    const {IdUser, WhsCode} = this.auth.getDataToken();
    if(!applyGR.Data) { // Process NOT EFFEM
      this.isEFEEM = false;
      if(this.numShipment !== null && this.numShipment !== ""){
        this.childSnak.openSnackBar('El lote NO APLICA para GR, NO debe ingresar un número de embarque', 'Cerrar','error-snackbar');  
        this.numShipment = null;
        this.fieldLabel = '';
      } else {
        if(!this.existCodebars(event)) {
          this.shipmentService.getBatch(event, WhsCode).subscribe(response => {
            if(response.Code === 0) {
              this.addRowTable(response.Data[0], WhsCode);
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
    } else { // Process EFFEM
      this.isEFEEM = true;
      if(this.client.partner && this.numShipment) {
          if(!this.existCodebars(event)){
            let lineRequest = this.existBatchInMemoryDocument(event);
            if(lineRequest !== -1){
              this.isValidEFFEM(event, lineRequest)
            }else {
              setTimeout(() => {
                this.childSnak.openSnackBar(`El lote ${event} no existe en el documento ${this.numShipment}`, 'Cerrar','warning-snackbar');
                this.fieldLabel = '';
              }, 100);
            }
          } else {
            setTimeout( () => {
              this.childSnak.openSnackBar('El lote ya fue leído', 'Cerrar','warning-snackbar');
              this.fieldLabel = '';
            }, 100);
          }
      } else {
        this.childSnak.openSnackBar('Este Lote aplica para EFFEM, debe ingresar un número de documento', 'Cerrar','warning-snackbar');
        this.fieldLabel = '';
      }
    }
  }
  
  addRowTable(response: any, whsCode: string) {
    const result = this.validateRead(response, whsCode)
    if(result){
      const { AbsEntryBatch, DistNumber, BinCode, AbsEntry, ItemCode, ItemName, Quantity, WhsCode, Status, U_stFolio, ItmsGrpCod } = response;
      this.rowData.push({AbsEntryBatch: AbsEntryBatch, DistNumber: DistNumber, BinCode: BinCode, AbsEntry: AbsEntry, ItemCode: ItemCode, ItemName: ItemName, Quantity: Quantity, WhsCode: WhsCode, ItmsGrpCod: ItmsGrpCod, U_stFolio: U_stFolio, DocNum: 0, DocEntry: 0 });
      this.gridApi.setRowData(this.rowData);
      this.fieldLabel = '';
    }
  }

  addRowTableEFFEM(lineRequest: number) {
    const {U_LoteSAP: DistNumber, BinCode, AbsEntryF, AbsEntryT, ItemCode, ItemName, Quantity, FromWhsCod: FromWhsCod, WhsCode , Status, U_stFolio, DocEntry, DocNum, LineNum, GR, OC} = this.memoryDocument[lineRequest];
    this.rowData.push({DistNumber: DistNumber, BinCode: BinCode, AbsEntry: AbsEntryF, AbsEntryT: AbsEntryT, ItemCode: ItemCode, ItemName: ItemName, Quantity: Quantity, FromWhsCode: FromWhsCod, ToWhsCode: WhsCode, U_stFolio: U_stFolio, DocNum: DocNum, DocEntry: DocEntry, LineNum: LineNum, OC: OC, GR: GR });
    this.gridApi.setRowData(this.rowData);
    this.fieldLabel = '';
  }

  validateRead(data: any, whsCode: string): boolean {
    let isValid = true;
    this.fieldLabel = '';
    if(!this.client.partner) {
      this.childSnak.openSnackBar('Debe seleccionar un cliente', 'Cerrar','warning-snackbar');
      isValid = false;
      return isValid;
    }
    if(whsCode !== data.WhsCode){
      this.childSnak.openSnackBar('El lote no pertenece al mismo almacén', 'Cerrar','warning-snackbar');
      isValid = false;
      return isValid;
    }
    if(data.Status !== 0){
      this.childSnak.openSnackBar('El lote esta bloqueado', 'Cerrar','warning-snackbar');
      isValid = false;
      return isValid;
    }
    const { U_GrpItems: groupItem} = this.client.listPartner.find(val => val.CardCode === this.client.partner );
    if(data.ItmsGrpCod !== groupItem){
      this.childSnak.openSnackBar('El lote NO pertenece al mismo grupo de Artículos', 'Cerrar','warning-snackbar');
      isValid = false;
      return isValid;
    }
    if(data.U_stFolio === 'R'){
      this.childSnak.openSnackBar('El lote ya fue Remisionado', 'Cerrar','warning-snackbar');
      isValid = false;
      return isValid;
    }
    return isValid;
  }

  async applyGR(batch: string) {
    const response = await this.shipmentService.applyGR(batch).toPromise();
    /* .catch( err => {
      this.childSnak.openSnackBar('Error al determinar si aplica GR', 'Cerrar','warning-snackbar');
    }); */
    return response;
  }

  existBatchInMemoryDocument(batch: string): number{
    const exist = this.memoryDocument.findIndex(val => val.U_LoteSAP === batch);
    return exist !== -1 ? exist : -1;
  }

  async isValidEFFEM(batch: string, lineRequest: number) {
    const validEFFEM = await this.shipmentService.validEFEEM(batch, 1).toPromise();
    /* .catch(err => {
      this.childSnak.openSnackBar('Error al validar si es EFFEM', 'Cerrar','warning-snackbar');
    }); */
    if(validEFFEM.Data !== null) {
      if(this.validRulesEFFEM(validEFFEM.Data)){
         if(this.validFirstPosition(validEFFEM.Data.OC)){
            this.addRowTableEFFEM(lineRequest);
         } else {
            this.childSnak.openSnackBar('El folio no tiene el mismo OC que el primer registro', 'Cerrar','warning-snackbar');
            this.fieldLabel = '';
         }
      }
    } else {
      this.childSnak.openSnackBar('Verifique si el lote tiene caracteristica EFFEM', 'Cerrar','warning-snackbar');
      this.fieldLabel = '';
    }
  }

  validRulesEFFEM(dataBatch: any): boolean {
    let validRule = true;
    this.fieldLabel = '';
    if(dataBatch.U_stFolio !== 'R') { // -10
      validRule = false;
      this.childSnak.openSnackBar('El lote no tiene el estatus de Remisionado', 'Cerrar','warning-snackbar');
    }
    if(dataBatch.GR.length === 0) { // -20
      validRule = false;
      this.childSnak.openSnackBar('El folio no tienen GR asignado', 'Cerrar','warning-snackbar');
    }
    if(dataBatch.OC.length === 0) { // -30
      validRule = false;
      this.childSnak.openSnackBar('El folio no tienen OC asignado', 'Cerrar','warning-snackbar');
    }
    return validRule;
  }
  
  validFirstPosition(paramOc: any): boolean {
    let validFirst = false;
    if(this.rowData.length > 0){
      if(this.rowData[0].OC === paramOc)
        validFirst = true;
      else
        validFirst = false;
    } else {
      validFirst = true;
    }
    return validFirst;
  }

  getDocumentShipment() {
    this.shipmentService.getDocumentShipment(this.numShipment).subscribe(response => {
      if(response.Data.length > 0) {
        this.memoryDocument = response.Data;
        this.client.partner = response.Data[0].CardCode;
        this.childSnak.openSnackBar('Documento cargado correctamente', 'Cerrar','success-snackbar');
      } else {
        this.childSnak.openSnackBar(`No se recuperaron datos para el documento ${this.numShipment}`, 'Cerrar','success-snackbar');
      }
    }, (err)=>{
      this.childSnak.openSnackBar(err.message, 'Cerrar','warning-snackbar');
    })
  }

  getListPartners() {
    this.shipmentService.getListClients().subscribe(response => {
      this.client.listPartner = response.Data;
    }, (err) => {
      this.childSnak.openSnackBar(err.message, 'Cerrar','warning-snackbar');
    })
  }

  existCodebars(codebars: string) : boolean {
    let result = false;
    this.gridApi.forEachNode(node => {
      if(node.data.DistNumber === codebars) result = true;
    });
    return result;
  }

  changeClient() {
    const group = this.client.listPartner.find(val => val.CardCode === this.client.partner);
    if(group) {
      if(group.U_GrpItems === null) {
        this.childSnak.openSnackBar('El cliente seleccionado NO TIENE GRUPO de artículos', 'Cerrar','warning-snackbar');
      }
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
    this.client.partner = null;
    this.numShipment = null;
    this.isEFEEM = false;
  }

}
