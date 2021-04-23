export class binLocation {
    BinAbsEntry: number;
    BinActionType: number;
    BaseLineNumber: number;
    Quantity: number;
    SerialAndBatchNumbersBaseLine: number;

    constructor(BinAbsEntry_: number, BinActionType_: number, BaseLineNumber_: number, Quantity_ : number, SerialAndBatchNumbersBaseLine_ : number){
        this.BinAbsEntry = BinAbsEntry_;
        this.BinActionType = BinActionType_;
        this.BaseLineNumber = BaseLineNumber_;
        this.Quantity = Quantity_;
        this.SerialAndBatchNumbersBaseLine = SerialAndBatchNumbersBaseLine_;
    }
}

export class batchNumbers {
    /* BatchNumber: string;
    Location: string;
    Quantity: number;
    BaseLineNumber: number;
 */
    constructor(BatchNumber: string, Location: string, Quantity: number, BaseLineNumber: number){};
}

export class transferLine {
    /* LineNum: number;
    ItemCode: string;
    Dscription: string;
    Quantity: number; 
    WarehouseCode: string;
    FromWarehouseCode: string;
    BatchNumbers: batchNumbers[];
    StockTransferLinesBinAllocations: binLocation[]; */
    constructor(ItemCode: string, Quantity: number,  WarehouseCode: string, FromWarehouseCode: string, BatchNumbers: batchNumbers[], StockTransferLinesBinAllocations: binLocation[]) {}
}

export class transfer {
    /* Series: string;
    DocDate: Date;
    FromWarehouse: string;
    ToWarehouse: string;
    U_Destino: string;
    U_OrigenMov: string;
    U_UsrHH: string;
    StockTransferLines: transferLine[]; */
    constructor(Series: string, DocDate: Date, FromWarehouse: string, ToWarehouse: string, U_Destino: string, U_OrigenMov: string, U_UsrHH: string, StockTransferLines: transferLine[]){}
}