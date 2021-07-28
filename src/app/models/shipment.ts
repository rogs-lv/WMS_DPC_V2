export class documentship {
    DocEntry: number;
    DocNum: number;
    DocDate: string;
    CardCode: string;
    CardName: string;
    LineNum: number;
    ItemCode: string;
    ItemName: string;
    AbsEntryF: number;
    BinCode: string;
    FromWhsCod: string;
    AbsEntryT: number;
    WhsCode: string;
    Quantity: number;
    U_LoteSAP: string;
    Status: number;
    U_stFolio: string;
    OC: string;
    GR: string;
}

export class shipmentProcess {
    DistNumber: string;
    BinCode: string;
    AbsEntry: number;
    AbsEntryT: number;
    ItemCode: string;
    Quantity: number;
    FromWhsCode: string;
    ToWhsCode: string;
    U_stFolio: string;
    DocNum: number;
    DocEntry: number;
    LineNum: number;
    OC: string;
    GR: string;
}

export class shipmentSAP {
    DocEntry: number;
    DocNum: number;
    Error: string;
    constructor (docEntry: number, docNum: number, error_?: string) {
        this.DocEntry = docEntry;
        this.DocNum = docNum;
        this.Error = error_;
    }
}