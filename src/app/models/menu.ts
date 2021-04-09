export class sub_module {
    path: string;
    title: string;
    icon: string;
}

export class module {
    path: string;
    title: string;
    icon: string;
    submodules: sub_module[];
}
