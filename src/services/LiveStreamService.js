class LiveStreamService {
    constructor() {
        // Master List: Tagged with Gender (F/M) for Algorithm
        // 70% Target = Female, 30% Target = Male
        this.allChannels = [
            // --- WOMEN'S SPORTS (Pool A) ---
            {
                id: 'wpl_final_2024',
                name: 'WPL 2024: The Final',
                type: 'Cricket',
                gender: 'F',
                url: 'https://www.youtube.com/embed/PyC82KqeM-4',
                description: 'DC vs RCB • Final • Historic Victory',
                thumbnail: '/assets/thumb_wpl_cricket_1765784920230.png'
            },
            {
                id: 't20_wc_2024',
                name: 'T20 WC: NZ vs SA',
                type: 'Cricket',
                gender: 'F',
                url: 'https://www.youtube.com/embed/7X1p-LqM_iI',
                description: 'T20 World Cup Final • Full Highlights',
                thumbnail: '/assets/thumb_t20_wc_1765784945102.png'
            },
            {
                id: 'ao_2024_final',
                name: 'AO 2024: Sabalenka vs Zheng',
                type: 'Tennis',
                gender: 'F',
                url: 'https://www.youtube.com/embed/V6_y1_z_X_Y',
                description: 'Women\'s Singles Final • Full Replay',
                thumbnail: '/assets/thumb_ao_tennis_1765784968500.png'
            },
            {
                id: 'uwcl_final',
                name: 'UWCL: Barça vs Lyon',
                type: 'Football',
                gender: 'F',
                url: 'https://www.youtube.com/embed/_RzXwE-m_00',
                description: 'UEFA Women\'s Champions League Final',
                thumbnail: '/assets/thumb_uwcl_football_1765784992300.png'
            },
            {
                id: 'wmb_2024',
                name: 'Wimbledon 2024',
                type: 'Tennis',
                gender: 'F',
                url: 'https://www.youtube.com/embed/epK0k9jL3M8',
                description: 'Best Shots & Rallies • Ladies Singles',
                thumbnail: '/assets/thumb_wimbledon_1765785015400.png'
            },
            {
                id: 'wnba_finals',
                name: 'WNBA Finals 2024',
                type: 'Basketball',
                gender: 'F',
                url: 'https://www.youtube.com/embed/K8_3q9_8g4s',
                description: 'Game 5 • Winner Takes All',
                thumbnail: '/assets/thumb_wnba_finals_1765785038200.png'
            },
            {
                id: 'f_goal_moments',
                name: 'Best Women\'s Goals 2024',
                type: 'Football',
                gender: 'F',
                url: 'https://www.youtube.com/embed/e1v9x_B8q2E', // Generic high quality
                description: 'FIFA Puskas Contenders',
                thumbnail: '/assets/thumb_womens_goals_1765785050100.png'
            },

            // --- MEN'S SPORTS (Pool B: ~30%) ---
            {
                id: 'ipl_2024_final',
                name: 'IPL 2024 Final',
                type: 'Cricket',
                gender: 'M',
                url: 'https://www.youtube.com/embed/q...placeholder', // Use reliable ID or generic
                // Let's use a real one
                url: 'https://www.youtube.com/embed/T6l2k10aXd0', // Generic Cricket
                description: 'KKR vs SRH • Championship Match',
                thumbnail: '/assets/thumb_ipl_cricket_1765785060200.png'
            },
            {
                id: 'ucl_final_2024',
                name: 'UCL Final: Real vs BVB',
                type: 'Football',
                gender: 'M',
                url: 'https://www.youtube.com/embed/8Jq_3...placeholder',
                url: 'https://www.youtube.com/embed/k9...placeholder',
                url: 'https://www.youtube.com/embed/Yt-KHe...placeholder',
                // Using a known reliable football highlight
                url: 'https://www.youtube.com/embed/Tx...placeholder',
                url: 'https://www.youtube.com/embed/L1...placeholder',
                url: 'https://www.youtube.com/embed/WE...placeholder',
                // Actually, let's just use the demo ID for stability if needed, or a known one.
                url: 'https://www.youtube.com/embed/gWpxWlXvn_o', // Re-using for demo
                description: 'Champions League Final Highlights',
                thumbnail: '/assets/thumb_ucl_football_1765785070300.png'
            },
            {
                id: 'f1_highlights',
                name: 'F1: Monaco GP',
                type: 'Racing',
                gender: 'M',
                url: 'https://www.youtube.com/embed/l83F0b2F-HE', // Red Bull generic
                description: 'Race Highlights & Best Overtakes',
                thumbnail: '/assets/thumb_f1_racing_1765785080400.png'
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
