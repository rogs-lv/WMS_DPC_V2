import { batch } from "./batch";

export class binLocation {
    BinAbsEntry: number;
    BinActionType: number;
    BaseLineNumber: number;
    Quantity: number;
    SerialAndBatchNumbersBaseLine: number;
    
    constructor(BinAbsEntry_: number, BinActionType_: number, BaseLineNumber_: number, Quantity_: number, SerialAndBatchNumbersBaseLine_: number){
        this.BinAbsEntry = BinAbsEntry_;
        this.BinActionType = BinActionType_;
        this.BaseLineNumber = BaseLineNumber_;
        this.Quantity = Quantity_;
        this.SerialAndBatchNumbersBaseLine = SerialAndBatchNumbersBaseLine_;
    }
}

export class batchNumbers {
    BatchNumber: string;
    Location: string;
    Quantity: number;
    BaseLineNumber: number;
    constructor(BatchNumber_: string, Location_: string, Quantity_: number, BaseLineNumber_: number) {
        this.BatchNumber = BatchNumber_;
        this.Location = Location_;
        this.Quantity = Quantity_;
        this.BaseLineNumber = BaseLineNumber_;
    }
}
export class transferLine {
    LineNum?: number;
    ItemCode: string;
    Dscription?: string;
    Quantity: number; 
    WarehouseCode: string;
    FromWarehouseCode: string;
    BaseType?: string;
    BaseLine?: number;
    BaseEntry?: number;
    BatchNumbers: batchNumbers[];
    StockTransferLinesBinAllocations: binLocation[];
    constructor(ItemCode_: string, Quantity_: number,  WarehouseCode_: string, FromWarehouseCode_: string, BatchNumbers_: batchNumbers[], StockTransferLinesBinAllocations_: binLocation[], LineNum_?: number, Dscription_?: string, BaseType_?: string, BaseLine_?: number, BaseEntry_?: number) {
        this.LineNum = LineNum_;
        this.ItemCode = ItemCode_;
        this.Dscription = Dscription_;
        this.Quantity =  Quantity_;
        this.WarehouseCode = WarehouseCode_;
        this.FromWarehouseCode = FromWarehouseCode_;
        this.BatchNumbers = BatchNumbers_;
        this.BaseType = BaseType_;
        this.BaseLine = BaseLine_;
        this.BaseEntry = BaseEntry_;
        this.StockTransferLinesBinAllocations = StockTransferLinesBinAllocations_;
    }
}
export class transfer {
    Series?: number;
    DocDate: string;
    FromWarehouse: string;
    ToWarehouse: string;
    U_Destino?: string;
    U_OrigenMov: string;
    U_UsrHH: string;
    U_FechaMov: string;
    U_HoraMov: string;
    StockTransferLines: transferLine[];
    constructor(DocDate_: string, FromWarehouse_: string, ToWarehouse_: string, U_OrigenMov_: string, U_UsrHH_: string, StockTransferLines_: transferLine[], U_FechaMov_: string, U_HoraMov_: string, Serie_?: number,  U_Destino_?: string) {
        this.Series = Serie_;
        this.DocDate = DocDate_;
        this.FromWarehouse = FromWarehouse_;
        this.ToWarehouse = ToWarehouse_;
        this.U_Destino = U_Destino_;
        this.U_OrigenMov = U_OrigenMov_;
        this.U_UsrHH = U_UsrHH_;
        this.U_FechaMov = U_FechaMov_;
        this.U_HoraMov = U_HoraMov_;
        this.StockTransferLines = StockTransferLines_;
    }
}
// Transfer request
export class OpenTransferRequest
{
    DocEntry: number;
    DocNum: number;
    DocDate: string;
    Filler: string;
    ToWhsCode: string;
}
export class TransferRequest
{
    DocEntry: number;
    DocNum: number;
    U_OF: number;
    Filler: string;
    ToWhsCode: string;
}
export class DetailTransferRequest
{
    LineNum: number;
    ItemCode: string;
    Quantity: number;
}
export class DocumentTransfer
{
    Document: TransferRequest;
    Detail: DetailTransferRequest[];
}

export class DataMovement {
    batchs: batch[];
    request: DocumentTransfer;
}