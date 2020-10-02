import {Question} from './question.model';

export class Session {
    private static readonly unsureThreshold = 2;
    private static readonly halfwayThreshold = 4;
    rightQuestions: Question[];
    wrongQuestions: Question[];
    private startTimestamp: Date;
    private endTimestamp: Date;

    constructor() {
        this.rightQuestions = [];
        this.wrongQuestions = [];
        this.startTimestamp = new Date();
    }

    addWronglyAnsweredQuestion(question: Question){
        this.wrongQuestions.push(question);
    }

    addCorrectlyAnsweredQuestion(question: Question){
        this.rightQuestions.push(question);
    }

    /** Returns an array [unsure questions, halfway questions, learned questions] of this session
     * @return: number[]
     */
    generateSessionStats(): number[]{
        this.endTimestamp = new Date();
        const res = new Array<number>(3);
        // init array
        for (let i = 0; i < res.length; i++){
            res[i] = 0;
        }
        // iterate correctly answered questions
        for (const question of this.rightQuestions){
            if (question.progress <= Session.unsureThreshold){
                // questions tagged as "Unsure"
                res[0]++;
            }else if (question.progress <= Session.halfwayThreshold){
                // questions tagged as "Halfway"
                res[1]++;
            } else {
                res[2]++;
            }
        }

        // iterate wrongly answered questions
        for (const question of this.wrongQuestions){
            res[0]++;
        }
        return res;
    }

    getQuestionCount(): number{
        return this.rightQuestions.length + this.wrongQuestions.length;
    }

    getCorrectQuestionCount(): number {
        return this.rightQuestions.length;
    }

    getEndTimestamp(){
        return this.endTimestamp;
    }

    getStartTimestamp(){
        return this.startTimestamp;
    }
}
