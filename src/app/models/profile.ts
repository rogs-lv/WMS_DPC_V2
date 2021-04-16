import { module } from "./module";

export class profile {
    IdUser: string;
    NameUser: string;
    FirstName: string;
    LastName: string;
    Status: boolean;
    WhsCode: string;
    Password: string;
}

export class additionalSettings {
    IdConfig: string;
    NameConfig: string;
    Status: boolean;
}

export class profileUser {
    UserProfile: profile;
    UserModules: module[];
    UserAdditionalSettings: additionalSettings[];
}