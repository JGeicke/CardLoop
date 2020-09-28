import {Question} from './question.model';

export class Session {
    private unsureThreshold = 2;
    private halfwayThreshold = 4;
    rightQuestions: Question[];
    wrongQuestions: Question[];

    constructor() {
        this.rightQuestions = [];
        this.wrongQuestions = [];
    }

    addWronglyAnsweredQuestion(question: Question){
        this.wrongQuestions.push(question);
    }

    addCorrectlyAnsweredQuestion(question: Question){
        this.rightQuestions.push(question);
    }

    generateSessionStats(): number[]{
        const res = new Array<number>(3);
        // iterate correctly answered questions
        for (const question of this.rightQuestions){
            if (question.progress <= this.unsureThreshold){
                // questions tagged as "Unsure"
                res[0]++;
            }else if (question.progress <= this.halfwayThreshold){
                // questions tagged as "Halfway"
                res[1]++;
            } else {
                res[2]++;
            }
        }
        return res;
    }
}
