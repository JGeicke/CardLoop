export class Achievement {
    /**
     * id of achievement - currently unused
     */
    achievementID: string;
    /**
     * name of achievement
     */
    achievementName: string;
    /**
     * description of achievement
     */
    achievementText: string;
    /**
     * current progress of achievement
     */
    currentNumber: number;
    /**
     * maximum progress of achievement that completes it
     */
    maxNumber: number;
    /**
     * SVG-icon of achievement
     */
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
