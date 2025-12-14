export const matches = [
    { id: 'm1', team1: 'Mumbai Indians', team2: 'Chennai Super Kings', status: 'LIVE', score: '145/3 (15.2)', league: 'IPL' },
    { id: 'm2', team1: 'Manchester United', team2: 'Liverpool', status: 'Upcoming', time: '20:00 IST', league: 'Premier League' },
    { id: 'm3', team1: 'Lakers', team2: 'Warriors', status: 'LIVE', score: '110-108 (Q4)', league: 'NBA' },
    { id: 'm4', team1: 'Djokovic', team2: 'Alcaraz', status: 'Finished', score: '6-4, 4-6, 7-6', league: 'Wimbledon Final' }
];

export const players = [
    { id: 'p1', name: 'Virat Kohli', team: 'RCB', role: 'Batsman' },
    { id: 'p2', name: 'LeBron James', team: 'Lakers', role: 'Forward' },
    { id: 'p3', name: 'Cristiano Ronaldo', team: 'Al Nassr', role: 'Forward' }
];

export const users = [
    { id: 'u1', name: 'CricketFan99', avatar: 'CF' },
    { id: 'u2', name: 'SoccerMom', avatar: 'SM' },
    { id: 'u3', name: 'HoopsLife', avatar: 'HL' }
];

export const threadTemplates = [
    { title: "Live Match Discussion: {team1} vs {team2}", category: "Live Match Reactions", type: "match" },
    { title: "GOAT Debate: {player} vs The World", category: "Player Performance Talk", type: "player" },
    { title: "Tactical Masterclass: {team1}'s strategy", category: "Tactical Analysis", type: "match" },
    { title: "Transfer News: {player} to {team}?", category: "Rumor Mill", type: "player" }
];

export const circles = [
    { id: 'c1', name: 'Viratians', type: 'Player', refId: 'p1', members: 15400, reqReputation: 50, icon: '👑' },
    { id: 'c2', name: 'Red Devils', type: 'Team', refId: 't_utd', members: 55000, reqReputation: 100, icon: '😈' },
    { id: 'c3', name: 'Laker Nation', type: 'Team', refId: 't_lakers', members: 32000, reqReputation: 80, icon: '🏀' },
    { id: 'c4', name: 'CR7 Ultras', type: 'Player', refId: 'p3', members: 120000, reqReputation: 500, icon: '⚽' }
];

export const predictionQuestions = [
    { id: 1, q: "Will Kohli score 50+ today?", sport: "Cricket", multiplier: 2.0 },
    { id: 2, q: "Will Man Utd keep a clean sheet?", sport: "Football", multiplier: 1.8 },
    { id: 3, q: "Total points over 220.5?", sport: "Basketball", multiplier: 1.9 },
    { id: 4, q: "Who wins the first set?", sport: "Tennis", multiplier: 1.5 }
];

export const levels = [
    { name: 'New Fan', minPoints: 0, perks: ['Join Circles'] },
    { name: 'Core Fan', minPoints: 500, perks: ['Post Polls', 'Badge'] },
    { name: 'Super Fan', minPoints: 1500, perks: ['Early Access', 'Meet Priority'] },
    { name: 'Captain', minPoints: 5000, perks: ['Moderator Status', 'Direct AMA'] }
];

export const userStats = {
    points: 350,
    level: 'New Fan',
    reputation: 85,
    joinedCircles: ['c1'],
    predictions: { total: 10, correct: 6 }
};
