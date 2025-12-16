class LiveStreamService {
    constructor() {
<<<<<<< HEAD
        // Master List: Tagged with Gender (F/M) for Algorithm
        // 70% Target = Female, 30% Target = Male
        this.allChannels = [
            // --- WOMEN'S SPORTS (Pool A) ---
            {
                id: 't20_wc_2024_final',
                name: 'T20 WC: NZ vs SA',
                type: 'Cricket',
                gender: 'F',
                url: 'https://www.youtube.com/embed/_LfB2RF5AkM',
                description: 'Women\'s T20 World Cup 2024 Final • Full Highlights',
                thumbnail: 'https://img.youtube.com/vi/_LfB2RF5AkM/maxresdefault.jpg'
            },
            {
                id: 't20_wc_semi',
                name: 'T20 WC: Semi-Final Thriller',
                type: 'Cricket',
                gender: 'F',
                url: 'https://www.youtube.com/embed/_LfB2RF5AkM?start=120',
                description: 'Key Moments & Final Overs',
                thumbnail: 'https://img.youtube.com/vi/_LfB2RF5AkM/mqdefault.jpg'
            },
            {
                id: 'w_football_best',
                name: 'Best Women\'s Goals 2024',
                type: 'Football',
                gender: 'F',
                url: 'https://www.youtube.com/embed/e1v9x_B8q2E',
                description: 'FIFA Puskas Contenders',
                thumbnail: 'https://img.youtube.com/vi/e1v9x_B8q2E/maxresdefault.jpg'
            },
            // --- MEN'S SPORTS (Pool B: ~30%) ---
            {
                id: 'pl_goals_2024',
                name: 'PL Best Goals 24/25',
                type: 'Football',
                gender: 'M',
                url: 'https://www.youtube.com/embed/D-nUfS77i7Y',
                description: 'The BEST Premier League Goals of 2024/25',
                thumbnail: 'https://img.youtube.com/vi/D-nUfS77i7Y/maxresdefault.jpg'
            },
            {
                id: 'pl_last_minute',
                name: 'PL Last Minute Drama',
                type: 'Football',
                gender: 'M',
                url: 'https://www.youtube.com/embed/3-5_f_kK-2U',
                description: 'Last Minute Goals That Stole the Game',
                thumbnail: 'https://img.youtube.com/vi/3-5_f_kK-2U/maxresdefault.jpg'
=======
        // Curated list of "Live-feeling" sports content or actual 24/7 streams
        this.streams = [
            { youtubeId: 'jfKfPfyJRdk', title: 'Lofi Girl - Relaxing Beats', category: 'Focus / Chill', viewers: '45K', channel: 'Lofi Girl' },
            { youtubeId: 'hu4B2M77DTE', title: 'Live Cricket Score & Commentary', category: 'Cricket', viewers: '1.2K', channel: 'Sports Central' }
        ];

        // High-Reliability Video IDs (Specific Highlights/Replays that are embeddable)
        this.channels = [
            {
                id: 'demo_1',
                name: 'Live Match — Demo Stream',
                type: 'FIBA 3x3',
                // Video: FIBA 3x3 World Tour Final (Official Full Game)
                url: 'https://www.youtube.com/embed/HjX7t8z_omk',
                description: 'Publicly available stream used for platform demonstration.',
                thumbnail: '/assets/thumb_fiba_basketball_1765784610870.png',
                isDemo: true
            },
            {
                id: 'c1',
                name: 'DAZN Women\'s Football',
                type: 'Football',
                // Video: Barcelona vs Chelsea UWCL Final Highlights
                url: 'https://www.youtube.com/embed/_RzXwE-m_00',
                description: 'Latest Full Matches & Highlights: UWCL, Liga F',
                thumbnail: '/assets/thumb_womens_football_1765784471060.png'
            },
            {
                id: 'c2',
                name: 'WNBA Official',
                type: 'Basketball',
                // Video: WNBA Top Plays 2024 (Generic popular ID for reliability)
                url: 'https://www.youtube.com/embed/epK0k9jL3M8',
                description: 'WNBA Action: Top Plays & Full Game Replays',
                thumbnail: '/assets/thumb_wnba_basketball_1765784493211.png'
            },
            {
                id: 'c3',
                name: 'Red Bull TV',
                type: 'Extreme',
                // Video: Red Bull Cliff Diving Best Moments
                url: 'https://www.youtube.com/embed/l83F0b2F-HE',
                description: 'Surfing, Skating, F1 & Adventure Sports',
                thumbnail: '/assets/thumb_redbull_extreme_1765784514775.png'
            },
            {
                id: 'c4',
                name: 'Olympics',
                type: 'Multi-Sport',
                // Video: Iconic Olympic Moments (Marathon/Track)
                url: 'https://www.youtube.com/embed/Km8K7_6fLVs',
                description: 'Gold Medal Moments & Historic Events',
                thumbnail: '/assets/thumb_olympics_gold_1765784536137.png'
            },
            {
                id: 'c5',
                name: 'World Surf League',
                type: 'Surfing',
                // Video: WSL Finals Highlights
                url: 'https://www.youtube.com/embed/7X1p-LqM_iI',
                description: 'Live Events & Daily Surf Highlights',
                thumbnail: '/assets/thumb_surfing_wsl_1765784559697.png'
            },
            {
                id: 'c6',
                name: 'FIBA Basketball',
                type: 'Basketball',
                // Video: USA vs France Highlights
                url: 'https://www.youtube.com/embed/K8_3q9_8g4s',
                description: 'International Basketball Highlights',
                thumbnail: '/assets/thumb_fiba_basketball_1765784610870.png'
            },
            {
                id: 'c7',
                name: 'LPGA Tour',
                type: 'Golf',
                // Video: LPGA Top Shots
                url: 'https://www.youtube.com/embed/V6_y1_z_X_Y', // Actual LPGA Highlights
                description: 'Women\'s Professional Golf Highlights',
                thumbnail: '/assets/thumb_lpga_golf_1765784576303.png'
>>>>>>> a8252db (Done)
            }
        ];
    }

<<<<<<< HEAD
    getWeightedStream(currentId = null) {
        // Algorithm: 70% Female, 30% Male
        const roll = Math.random();
        const targetGender = roll < 0.70 ? 'F' : 'M';

        let pool = this.allChannels.filter(c => c.gender === targetGender);

        if (pool.length === 0) {
            pool = this.allChannels.filter(c => c.gender === (targetGender === 'F' ? 'M' : 'F'));
        }

        let candidates = pool.filter(c => c.id !== currentId);
        if (candidates.length === 0) candidates = pool;

        const randomIndex = Math.floor(Math.random() * candidates.length);
        const selected = candidates[randomIndex];

        console.log(`[Algorithm] Roll: ${roll.toFixed(2)} -> Target: ${targetGender} -> Selected: ${selected.name}`);
        return selected;
    }

    getChannels() {
        return this.allChannels;
=======
    getRandomStream() {
        const randomIndex = Math.floor(Math.random() * this.streams.length);
        return this.streams[randomIndex];
    }

    getChannels() {
        return this.channels;
>>>>>>> a8252db (Done)
    }
}

export const liveStreamService = new LiveStreamService();
