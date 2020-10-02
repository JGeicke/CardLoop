export class Statistic {
    averageSessionTime: number;
    lessonCount: number;
    questionCount: number;
    registrationDate: Date;
    correctQuestionCount: number;

    constructor(averageSessionTime: number, lessonCount: number,
                questionCount: number, correctQuestionCount: number, registrationDate: Date) {
        this.averageSessionTime = averageSessionTime;
        this.lessonCount = lessonCount;
        this.questionCount = questionCount;
        this.correctQuestionCount = correctQuestionCount;
        this.registrationDate = registrationDate;
    }

    incrementLessonCount(){
        this.lessonCount++;
    }

    increaseQuestionCount(add: number){
        this.questionCount += add;
    }

    increaseCorrectQuestionCount(add: number){
        this.correctQuestionCount += add;
    }

    calcAverageSessionTime(startTime: Date, endTime: Date){
        const time = (endTime.getTime() - startTime.getTime()) / 1000;
        if (this.lessonCount > 2){
            this.averageSessionTime = ((this.averageSessionTime * (this.lessonCount - 1)) + time) / this.lessonCount;
        } else {
            this.averageSessionTime = (this.averageSessionTime  + time) / this.lessonCount;
        }
    }
}
