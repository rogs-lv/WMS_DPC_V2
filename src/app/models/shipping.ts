export class Partner {
    CardCode: string;
    CardName: string;
    U_GrpItems: number;
}

export class BusnessPartner {
    partner: string;
    listPartner: Partner[];
}

export class shippingLines {
    ItemCode: string;
    Quantity: string;
    WarehouseCode: string;
    FromWarehouseCode: string;
    U_LoteSAP: string;
    U_Location: string
    constructor( ItemCode_: string, Quantity_: string, WarehouseCode_: string, FromWarehouseCode_: string, U_LoteSAP_: string, U_Location_: string) {
        this.ItemCode = ItemCode_;
        this.Quantity = Quantity_;
        this.WarehouseCode = WarehouseCode_;
        this.FromWarehouseCode = FromWarehouseCode_;
        this.U_LoteSAP = U_LoteSAP_;
        this.U_Location = U_Location_;
    }
}

export class shippingDocument {
    Series?: number;
    CardCode: string;
    DocDate: string;
    FromWarehouse: string;
    ToWarehouse: string;
    U_Destino?: string;
    U_OrigenMov: string;
    U_UsrHH: string;
    U_FechaMov: string;
    U_HoraMov: string;
    StockTransferLines: shippingLines[];
    constructor(DocDate_: string, FromWarehouse_: string, ToWarehouse_: string, U_OrigenMov_: string, U_UsrHH_: string, StockTransferLines_: shippingLines[], U_FechaMov_: string, U_HoraMov_: string, Serie_?: number,  U_Destino_?: string, CardCode_?: string) {
        this.Series = Serie_;
        this.DocDate = DocDate_;
        this.CardCode = CardCode_;
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