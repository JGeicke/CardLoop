import {Question} from './question.model';

export class Session {
    /**
     * progress-threshhold that marks questions as unsure if progress <= threshhold
     */
    private static readonly unsureThreshold = 2;
    /**
     * progress-threshhold that marks questions as halfway if progress <= threshhold && progress > unsureThreshold
     */
    private static readonly halfwayThreshold = 4;
    /**
     * array of correctly answered questions
     */
    rightQuestions: Question[];
    /**
     * array of wrongly answered questions
     */
    wrongQuestions: Question[];
    /**
     * initialization-timestamp of the session
     */
    private startTimestamp: Date;
    /**
     * final timestamp of the session
     */
    private endTimestamp: Date;

    constructor() {
        this.rightQuestions = [];
        this.wrongQuestions = [];
        this.startTimestamp = new Date();
    }

    /**
     * Adds a question to the wrongly answered questions array
     * @param question - question to add
     */
    addWronglyAnsweredQuestion(question: Question){
        this.wrongQuestions.push(question);
    }

    /**
     * Adds a question to the correctly answered questions array
     * @param question - question to add
     */
    addCorrectlyAnsweredQuestion(question: Question){
        this.rightQuestions.push(question);
    }

    /** generates the stats of this session
     * @return: number[] - an stat array structured like [unsure questions, halfway questions, learned questions]
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

    /**
     * Calculates & returns total question count in the session
     * @return: number - total number of questions in the session
     */
    getQuestionCount(): number{
        return this.rightQuestions.length + this.wrongQuestions.length;
    }

    /**
     * Returns the count of correctly answered questions
     * @return: number
     */
    getCorrectQuestionCount(): number {
        return this.rightQuestions.length;
    }

    /**
     * Returns final timestamp of the session
     * @return: Date
     */
    getEndTimestamp(){
        return this.endTimestamp;
    }

    /**
     * Returns initialization-timestamp of the session
     * @return: Date
     */
    getStartTimestamp(){
        return this.startTimestamp;
    }
}
