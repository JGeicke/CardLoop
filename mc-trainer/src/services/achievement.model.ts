export class Achievement {
    achievementID: string;   // ID of the achievement
    achievementName: string; // Name of the achievement
    achievementText: string; // Description if the achievement
    currentNumber: number;   // Current progress in the achievement
    maxNumber: number;       // The maximum progress that can be achieved
    achievementSVG: string;  // Place of the SVG of the achievement

    constructor(achievementID: string, achievementName: string, achievementText: string, currentNumber: number,
                maxNumber: number, achievementSVG: string) {
        this.achievementID = achievementID;
        this.achievementName = achievementName;
        this.achievementText = achievementText;
        this.currentNumber = currentNumber;
        this.maxNumber = maxNumber;
        this.achievementSVG = achievementSVG;
    }
}
