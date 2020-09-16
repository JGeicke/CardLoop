import {Question} from './question.model';

export class Module {
    uid: string;
    description: string;
    name: string;
    tags: string[];
    questions: Question[];

    constructor(uid: string, description: string, name: string, tags: string[]) {
        this.uid = uid;
        this.description = description;
        this.name = name;
        this.tags = tags;
        this.questions = [];
    }
}
