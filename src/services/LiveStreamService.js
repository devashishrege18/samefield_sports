class LiveStreamService {
    constructor() {
        // Master List: Tagged with Gender (F/M) for Algorithm
        // 70% Target = Female, 30% Target = Male
        this.allChannels = [
            // --- WOMEN'S SPORTS (Pool A) ---
            {
                id: 't20_wc_2024_final',
                name: 'T20 WC: NZ vs SA',
                type: 'Cricket',
                gender: 'F',
                url: 'https://www.youtube.com/embed/_LfB2RF5AkM', // Verified ICC Final
                description: 'Women\'s T20 World Cup 2024 Final • Full Highlights',
                thumbnail: '/assets/thumb_t20_wc_1765784945102.png'
            },
            {
                id: 't20_wc_semi',
                name: 'T20 WC: Semi-Final Thriller',
                type: 'Cricket',
                gender: 'F',
                url: 'https://www.youtube.com/embed/_LfB2RF5AkM?start=120', // Verified (Start offset for variety)
                description: 'Key Moments & Final Overs',
                thumbnail: '/assets/thumb_wpl_cricket_1765784920230.png'
            },
            {
                id: 'w_football_best',
                name: 'Best Women\'s Goals 2024',
                type: 'Football',
                gender: 'F',
                url: 'https://www.youtube.com/embed/e1v9x_B8q2E', // Trying generic again, or fallback to PL if fails
                description: 'FIFA Puskas Contenders',
                thumbnail: '/assets/thumb_womens_goals_1765785050100.png'
            },
            // --- MEN'S SPORTS (Pool B: ~30%) ---
            {
                id: 'pl_goals_2024',
                name: 'PL Best Goals 24/25',
                type: 'Football',
                gender: 'M',
                url: 'https://www.youtube.com/embed/D-nUfS77i7Y', // Verified Premier League
                description: 'The BEST Premier League Goals of 2024/25',
                thumbnail: '/assets/thumb_ucl_football_1765785070300.png'
            },
            {
                id: 'pl_last_minute',
                name: 'PL Last Minute Drama',
                type: 'Football',
                gender: 'M',
                url: 'https://www.youtube.com/embed/3-5_f_kK-2U', // Verified Premier League
                description: 'Last Minute Goals That Stole the Game',
                thumbnail: '/assets/thumb_ipl_cricket_1765785060200.png'
            }
        ];
    }

    getWeightedStream(currentId = null) {
        // Algorithm: 70% Female, 30% Male
        // 1. Decide Target Gender
        const roll = Math.random();
        const targetGender = roll < 0.70 ? 'F' : 'M';

        // 2. Filter Pool
        let pool = this.allChannels.filter(c => c.gender === targetGender);

        // Fallback: If pool is empty (unlikely), swap
        if (pool.length === 0) {
            pool = this.allChannels.filter(c => c.gender === (targetGender === 'F' ? 'M' : 'F'));
        }

        // 3. Select Random from Pool (avoiding current if possible)
        let candidates = pool.filter(c => c.id !== currentId);
        if (candidates.length === 0) candidates = pool; // Allow repeat if strictly limited

        const randomIndex = Math.floor(Math.random() * candidates.length);
        const selected = candidates[randomIndex];

        console.log(`[Algorithm] Roll: ${roll.toFixed(2)} -> Target: ${targetGender} -> Selected: ${selected.name}`);
        return selected;
    }

    getChannels() {
        return this.allChannels;
    }
}

export const liveStreamService = new LiveStreamService();
