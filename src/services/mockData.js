export const matches = [
    { id: 'm1', team1: 'Mumbai Indians', team2: 'Chennai Super Kings', status: 'LIVE', score: '145/3 (15.2)', league: 'IPL' },
    { id: 'm2', team1: 'Royal Challengers Bangalore', team2: 'Delhi Capitals', status: 'Upcoming', time: '19:30 IST', league: 'IPL' },
    { id: 'm3', team1: 'India Women', team2: 'Australia Women', status: 'LIVE', score: '220/5 (45.0)', league: 'Test Match' }
];

export const players = [
    { id: 'p1', name: 'Virat Kohli', team: 'RCB', role: 'Batsman' },
    { id: 'p2', name: 'Smriti Mandhana', team: 'India Women', role: 'Batsman' },
    { id: 'p3', name: 'Jasprit Bumrah', team: 'Mumbai Indians', role: 'Bowler' }
];

export const users = [
    { id: 'u1', name: 'CricketFan99', avatar: 'CF' },
    { id: 'u2', name: 'StadiumLover', avatar: 'SL' },
    { id: 'u3', name: 'TacticalGenius', avatar: 'TG' }
];

export const threadTemplates = [
    { title: "Live Match Discussion: {team1} vs {team2}", category: "Live Match Reactions", type: "match" },
    { title: "Player Watch: {player} - Performance Discussion", category: "Player Performance Talk", type: "player" },
    { title: "Tactical Analysis: Key moments from {match}", category: "Tactical Analysis", type: "match" },
    { title: "Post-Match Review: {team1} vs {team2}", category: "Post-Match Review", type: "match" }
];
