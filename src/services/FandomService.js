import { circles, levels, userStats } from './mockData';

class FandomService {
    constructor() {
        this.circles = circles;
        this.currentUser = { ...userStats }; // Local state simulation
        this.levels = levels;
    }

    getUserStats() {
        return this.currentUser;
    }

    getCircles() {
        return this.circles;
    }

    joinCircle(circleId) {
        const circle = this.circles.find(c => c.id === circleId);
        if (!circle) return { success: false, msg: 'Circle not found' };

        if (this.currentUser.joinedCircles.includes(circleId)) {
            return { success: false, msg: 'Already a member' };
        }

        if (this.currentUser.reputation < circle.reqReputation) {
            return { success: false, msg: `Reputation too low. Need ${circle.reqReputation}` };
        }

        // Success
        this.currentUser.joinedCircles.push(circleId);
        this.addPoints(50); // Bonus for joining
        return { success: true, msg: `Joined ${circle.name}!` };
    }

    makePrediction(isCorrectSimulation = true) {
        // Simulate prediction result for demo
        this.currentUser.predictions.total += 1;
        if (isCorrectSimulation) {
            this.currentUser.predictions.correct += 1;
            this.addPoints(100);
            return { result: 'WIN', msg: 'Prediction Correct! +100 Points' };
        } else {
            return { result: 'LOSS', msg: 'Better luck next time!' };
        }
    }

    addPoints(amount) {
        this.currentUser.points += amount;
        this.checkLevelUp();
    }

    checkLevelUp() {
        // Find highest level user qualifies for
        for (let i = this.levels.length - 1; i >= 0; i--) {
            if (this.currentUser.points >= this.levels[i].minPoints) {
                if (this.currentUser.level !== this.levels[i].name) {
                    this.currentUser.level = this.levels[i].name;
                    // Could trigger a toast here
                }
                break;
            }
        }
    }

    getNextLevel() {
        const current = this.levels.find(l => l.name === this.currentUser.level);
        const next = this.levels.find(l => l.minPoints > this.currentUser.points);
        return next || { name: 'Max Level', minPoints: this.currentUser.points };
    }
}

export const fandomService = new FandomService();
