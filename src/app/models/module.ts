export class module {
    IdModule: string;
    Path: string;
    Title: string;
    Icon: string;
    Status: string;
    Principal: string;
    Submodules: submodule[];
}

export class submodule {
    Path: string;
    Title: string;
    Icon: string;
}