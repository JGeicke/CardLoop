export class Question {
    uid: string;
    question: string;
    answers: string[];
    solutions: number[];

    constructor(uid: string, question: string, answers: string[], solutions: number[]) {
        this.uid = uid;
        this.question = question;
        this.answers = answers;
        this.solutions = solutions;
    }
}
