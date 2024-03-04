import type { Url } from "./HttpRequest";

type Action = {
    name: string,
    url: Url
}

export class Data {
    static currentId = -1;

    id: number;
    title: string;
    content: string;
    actions: Action[];

    constructor(title: string, content: string, actions: Action[]) {
        this.id = ++Data.currentId
        this.title = title
        this.content = content
        this.actions = actions
    }
}