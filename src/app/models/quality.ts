export class fieldAction {
    Locked: boolean;
    Unlocked: boolean;
    Move: boolean;
    WhsCode: string;
    constructor(){
        this.Locked = false;
        this.Unlocked = false;
        this.Move = false;
        this.WhsCode = '';
    }
}

export class lineQuality {
    BatchNumber: string;
    OnHandQty: number;
    ItemCode: string;
    ItemName: string;
}