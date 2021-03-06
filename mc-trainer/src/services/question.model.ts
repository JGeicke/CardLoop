export class Question {
    /**
     * max progress that completes the question - completed questions will not appear in the learnmode
     */
    public static readonly MAX_PROGRESS = 6;
    /**
     * uid of question generated by firebase
     * if the question was first created locally, please initialize the question-uid with '-1'
     */
    uid: string;
    /**
     * question of question-object
     */
    question: string;
    /**
     * possible answers of question
     */
    answers: string[];
    /**
     * indexes of correct answers
     */
    solutions: number[];
    /**
     * progress of question based on how many times it was answered correctly
     */
    progress: number;

    /**
     * static factory method for new locally created questions that are not yet stored in firebase
     * @param question - question e.g. 'What did u eat today?'
     * @param answers - possible answer(s) to that question
     * @param solutions - correct answer(s) to that question
     */
    static localQuestion(question: string, answers: string[], solutions: number[]): Question{
        return new Question('-1', question, answers, solutions);
    }

    constructor(uid: string, question: string, answers: string[], solutions: number[]) {
        this.uid = uid;
        this.question = question;
        this.answers = answers;
        this.solutions = solutions;
        this.progress = 0;
    }

    /**
     * set the progress of question
     * @param progress - progress of question
     */

    setProgress(progress: number){
        this.progress = progress;
    }

    /**
     * increment the progress of question
     */
    incrementProgress(){
        this.progress++;
    }

    /**
     * Reset the progress of question
     */
    resetProgress(){
        this.progress = 0;
    }
}
