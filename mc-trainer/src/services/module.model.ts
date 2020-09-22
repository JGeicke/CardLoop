import {Question} from './question.model';

export class Module {
    uid: string;
    description: string;
    name: string;
    tags: string[];
    questions: Question[];
    progress: number;

    constructor(uid: string, description: string, name: string, tags: string[]) {
        this.uid = uid;
        this.description = description;
        this.name = name;
        this.tags = tags;
        this.questions = [];
        this.progress = 0;
    }

    calcProgress() {
        let result = 0;
        this.questions.forEach(question => result += question.progress);
        this.progress = Math.round(((result / Question.MAX_PROGRESS) / this.questions.length) * 100);
    }
}
