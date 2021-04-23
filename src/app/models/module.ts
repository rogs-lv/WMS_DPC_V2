export class module {
    IdModule: string;
    Path: string;
    Title: string;
    Icon: string;
    Status: boolean;
    Principal: string;
    Submodules: submodule[];
}

export class submodule {
    Path: string;
    Title: string;
    Icon: string;
}

export class moduleHome {
    IdModule: string;
    Path: string;
    Title: string;
    Icon: string;
    Status: boolean;
    Principal: string;
}