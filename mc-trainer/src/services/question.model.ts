export class Question {
    public static readonly MAX_PROGRESS = 6;
    uid: string;
    question: string;
    answers: string[];
    solutions: number[];
    progress: number;

    constructor(uid: string, question: string, answers: string[], solutions: number[]) {
        this.uid = uid;
        this.question = question;
        this.answers = answers;
        this.solutions = solutions;
        this.progress = 0;
    }

    setProgress(progress: number){
        this.progress = progress;
    }

    incrementProgress(){
        this.progress++;
    }

    resetProgress(){
        this.progress = 0;
    }
}
