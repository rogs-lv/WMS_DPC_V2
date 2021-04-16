export interface moduleResponse {
    IdModule: string;
    Path: string;
    Title: string;
    Icon: string;
    Submodules: submoduleResponse[];
}

export interface submoduleResponse {
    Path: string;
    Title: string;
    Icon: string;
}