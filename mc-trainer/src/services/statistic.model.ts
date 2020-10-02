export class Statistic {
    /**
     * average time spent in the learnMode with single lesson by the user
     */
    averageSessionTime: number;
    /**
     * number of lessons played (single lesson can be played multiple times)
     */
    lessonCount: number;
    /**
     * total number of questions answered
     */
    questionCount: number;
    /**
     * registration date of the account
     */
    registrationDate: Date;
    /**
     * total number of questions correctly answered
     */
    correctQuestionCount: number;

    constructor(averageSessionTime: number, lessonCount: number,
                questionCount: number, correctQuestionCount: number, registrationDate: Date) {
        this.averageSessionTime = averageSessionTime;
        this.lessonCount = lessonCount;
        this.questionCount = questionCount;
        this.correctQuestionCount = correctQuestionCount;
        this.registrationDate = registrationDate;
    }

    /**
     * Increment the total lesson count
     */
    incrementLessonCount(){
        this.lessonCount++;
    }

    /**
     * Increase the total question count by given value
     * @param add - given value
     */
    increaseQuestionCount(add: number){
        this.questionCount += add;
    }

    /**
     * Increase the total correctly answered question count by given value
     * @param add - given value
     */
    increaseCorrectQuestionCount(add: number){
        this.correctQuestionCount += add;
    }

    /**
     * Calculate the average time spent in learnMode with a single lesson
     * @param startTime - initialization timestamp of the session
     * @param endTime - final timestamp of the session
     */
    calcAverageSessionTime(startTime: Date, endTime: Date){
        const time = (endTime.getTime() - startTime.getTime()) / 1000;
        if (this.lessonCount > 2){
            this.averageSessionTime = ((this.averageSessionTime * (this.lessonCount - 1)) + time) / this.lessonCount;
        } else {
            this.averageSessionTime = (this.averageSessionTime  + time) / this.lessonCount;
        }
    }
}
