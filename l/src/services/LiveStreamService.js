class LiveStreamService {
    constructor() {
        // Sport-specific thumbnail mapping
        this.sportThumbnails = {
            'Cricket': '/assets/thumb_cricket.png',
            'Football': '/assets/thumb_football.png',
            'Basketball': '/assets/thumb_basketball.png',
            'Athletics': '/assets/thumb_athletics.png',
            'Swimming': '/assets/thumb_swimming.png',
            'Kabaddi': '/assets/thumb_combat.png',
            'Boxing': '/assets/thumb_combat.png',
            'Combat Sports': '/assets/thumb_combat.png',
            'Tennis': '/assets/thumb_racquet.png',
            'Badminton': '/assets/thumb_racquet.png',
            'Racquet Sports': '/assets/thumb_racquet.png',
            'Surfing': '/assets/thumb_extreme.png',
            'Extreme Sports': '/assets/thumb_extreme.png'
        };

        // Master List with expanded content for scrollable galleries
        this.allChannels = [
            // ============ CRICKET (6 streams) ============
            {
                id: 'gully_cricket',
                name: 'Gully Cricket Championship',
                sport: 'Cricket',
                type: 'Cricket',
                tier: 'local',
                gender: 'M',
                url: 'https://www.youtube.com/embed/gON8rAzHhmo',
                description: 'Street Cricket Finals • Local Heroes',
                thumbnail: '/assets/thumb_cricket.png',
                viewers: Math.floor(Math.random() * 500) + 100
            },
            {
                id: 'school_cricket',
                name: 'Inter-School Cricket Tournament',
                sport: 'Cricket',
                type: 'Cricket',
                tier: 'local',
                gender: 'M',
                url: 'https://www.youtube.com/embed/gON8rAzHhmo',
                description: 'Under-19 State Finals',
                thumbnail: '/assets/thumb_cricket.png',
                viewers: Math.floor(Math.random() * 800) + 200
            },
            {
                id: 'club_cricket',
                name: 'Club Cricket League',
                sport: 'Cricket',
                type: 'Cricket',
                tier: 'local',
                gender: 'M',
                url: 'https://www.youtube.com/embed/gON8rAzHhmo',
                description: 'City League Semi-Final',
                thumbnail: '/assets/thumb_cricket.png',
                viewers: Math.floor(Math.random() * 600) + 150
            },
            {
                id: 'ipl_match',
                name: 'IPL: RCB vs CSK',
                sport: 'Cricket',
                type: 'Cricket',
                tier: 'national',
                gender: 'M',
                url: 'https://www.youtube.com/embed/gON8rAzHhmo',
                description: 'Indian Premier League • Match 42',
                thumbnail: '/assets/thumb_cricket.png',
                viewers: Math.floor(Math.random() * 15000) + 8000
            },
            {
                id: 'ranji_trophy',
                name: 'Ranji Trophy Final',
                sport: 'Cricket',
                type: 'Cricket',
                tier: 'national',
                gender: 'M',
                url: 'https://www.youtube.com/embed/gON8rAzHhmo',
                description: 'Mumbai vs Karnataka • Day 3',
                thumbnail: '/assets/thumb_cricket.png',
                viewers: Math.floor(Math.random() * 5000) + 2000
            },
            {
                id: 't20_wc_final',
                name: 'T20 World Cup Final',
                sport: 'Cricket',
                type: 'Cricket',
                tier: 'international',
                gender: 'F',
                url: 'https://www.youtube.com/embed/_LfB2RF5AkM',
                description: 'Women\'s T20 World Cup 2024 • NZ vs SA',
                thumbnail: '/assets/thumb_cricket.png',
                viewers: Math.floor(Math.random() * 50000) + 20000
            },
            {
                id: 'asia_cup',
                name: 'Asia Cup: India vs Pakistan',
                sport: 'Cricket',
                type: 'Cricket',
                tier: 'international',
                gender: 'M',
                url: 'https://www.youtube.com/embed/gON8rAzHhmo',
                description: 'Super 4 • High Voltage Clash',
                thumbnail: '/assets/thumb_cricket.png',
                viewers: Math.floor(Math.random() * 80000) + 40000
            },

            // ============ FOOTBALL (6 streams) ============
            {
                id: 'school_football',
                name: 'Inter-School Football Cup',
                sport: 'Football',
                type: 'Football',
                tier: 'local',
                gender: 'M',
                url: 'https://www.youtube.com/embed/e1v9x_B8q2E',
                description: 'Under-16 District Finals',
                thumbnail: '/assets/thumb_football.png',
                viewers: Math.floor(Math.random() * 300) + 50
            },
            {
                id: 'sunday_league',
                name: 'Sunday League Finals',
                sport: 'Football',
                type: 'Football',
                tier: 'local',
                gender: 'M',
                url: 'https://www.youtube.com/embed/e1v9x_B8q2E',
                description: 'Community Championship Final',
                thumbnail: '/assets/thumb_football.png',
                viewers: Math.floor(Math.random() * 400) + 100
            },
            {
                id: 'women_local_football',
                name: 'Women\'s City League',
                sport: 'Football',
                type: 'Football',
                tier: 'local',
                gender: 'F',
                url: 'https://www.youtube.com/embed/e1v9x_B8q2E',
                description: 'Rising Stars Championship',
                thumbnail: '/assets/thumb_football.png',
                viewers: Math.floor(Math.random() * 500) + 150
            },
            {
                id: 'isl_match',
                name: 'ISL: Mumbai vs Goa',
                sport: 'Football',
                type: 'Football',
                tier: 'national',
                gender: 'M',
                url: 'https://www.youtube.com/embed/3-5_f_kK-2U',
                description: 'Indian Super League Match Week 12',
                thumbnail: '/assets/thumb_football.png',
                viewers: Math.floor(Math.random() * 8000) + 3000
            },
            {
                id: 'i_league',
                name: 'I-League: Mohun Bagan vs East Bengal',
                sport: 'Football',
                type: 'Football',
                tier: 'national',
                gender: 'M',
                url: 'https://www.youtube.com/embed/3-5_f_kK-2U',
                description: 'Kolkata Derby • Classic Rivalry',
                thumbnail: '/assets/thumb_football.png',
                viewers: Math.floor(Math.random() * 6000) + 2500
            },
            {
                id: 'epl_match',
                name: 'EPL: Liverpool vs Arsenal',
                sport: 'Football',
                type: 'Football',
                tier: 'international',
                gender: 'M',
                url: 'https://www.youtube.com/embed/3-5_f_kK-2U',
                description: 'Premier League Matchday 20',
                thumbnail: '/assets/thumb_football.png',
                viewers: Math.floor(Math.random() * 120000) + 60000
            },
            {
                id: 'ucl_match',
                name: 'UCL: Real Madrid vs Bayern',
                sport: 'Football',
                type: 'Football',
                tier: 'international',
                gender: 'M',
                url: 'https://www.youtube.com/embed/3-5_f_kK-2U',
                description: 'Champions League Semi-Final',
                thumbnail: '/assets/thumb_football.png',
                viewers: Math.floor(Math.random() * 150000) + 80000
            },

            // ============ BASKETBALL (5 streams) ============
            {
                id: 'park_basketball',
                name: 'Streetball Sunday',
                sport: 'Basketball',
                type: 'Basketball',
                tier: 'local',
                gender: 'M',
                url: 'https://www.youtube.com/embed/D-nUfS77i7Y',
                description: '3x3 Park Tournament',
                thumbnail: '/assets/thumb_basketball.png',
                viewers: Math.floor(Math.random() * 200) + 80
            },
            {
                id: 'college_basketball',
                name: 'College Basketball Championship',
                sport: 'Basketball',
                type: 'Basketball',
                tier: 'local',
                gender: 'M',
                url: 'https://www.youtube.com/embed/D-nUfS77i7Y',
                description: 'Inter-University Finals',
                thumbnail: '/assets/thumb_basketball.png',
                viewers: Math.floor(Math.random() * 400) + 150
            },
            {
                id: 'ubl_basketball',
                name: 'UBA Pro League',
                sport: 'Basketball',
                type: 'Basketball',
                tier: 'national',
                gender: 'M',
                url: 'https://www.youtube.com/embed/D-nUfS77i7Y',
                description: 'United Basketball Alliance',
                thumbnail: '/assets/thumb_basketball.png',
                viewers: Math.floor(Math.random() * 3000) + 1000
            },
            {
                id: 'nba_game',
                name: 'NBA: Lakers vs Warriors',
                sport: 'Basketball',
                type: 'Basketball',
                tier: 'international',
                gender: 'M',
                url: 'https://www.youtube.com/embed/D-nUfS77i7Y',
                description: 'Regular Season Game',
                thumbnail: '/assets/thumb_basketball.png',
                viewers: Math.floor(Math.random() * 80000) + 40000
            },
            {
                id: 'wnba_game',
                name: 'WNBA: Aces vs Liberty',
                sport: 'Basketball',
                type: 'Basketball',
                tier: 'international',
                gender: 'F',
                url: 'https://www.youtube.com/embed/D-nUfS77i7Y',
                description: 'Women\'s NBA Finals',
                thumbnail: '/assets/thumb_basketball.png',
                viewers: Math.floor(Math.random() * 30000) + 15000
            },

            // ============ ATHLETICS (5 streams) ============
            {
                id: 'city_athletics',
                name: 'City Athletics Meet',
                sport: 'Athletics',
                type: 'Athletics',
                tier: 'local',
                gender: 'F',
                url: 'https://www.youtube.com/embed/_LfB2RF5AkM',
                description: '100m & 200m Finals • Rising Stars',
                thumbnail: '/assets/thumb_athletics.png',
                viewers: Math.floor(Math.random() * 800) + 200
            },
            {
                id: 'school_athletics',
                name: 'School Sports Day',
                sport: 'Athletics',
                type: 'Athletics',
                tier: 'local',
                gender: 'M',
                url: 'https://www.youtube.com/embed/_LfB2RF5AkM',
                description: 'Inter-School Track Events',
                thumbnail: '/assets/thumb_athletics.png',
                viewers: Math.floor(Math.random() * 400) + 100
            },
            {
                id: 'national_athletics',
                name: 'National Athletics Championship',
                sport: 'Athletics',
                type: 'Athletics',
                tier: 'national',
                gender: 'F',
                url: 'https://www.youtube.com/embed/e1v9x_B8q2E',
                description: 'Day 2 • Track Events',
                thumbnail: '/assets/thumb_athletics.png',
                viewers: Math.floor(Math.random() * 4000) + 1500
            },
            {
                id: 'olympics_athletics',
                name: 'Olympics: 100m Sprint Final',
                sport: 'Athletics',
                type: 'Athletics',
                tier: 'international',
                gender: 'M',
                url: 'https://www.youtube.com/embed/D-nUfS77i7Y',
                description: 'Paris 2024 • Men\'s Final',
                thumbnail: '/assets/thumb_athletics.png',
                viewers: Math.floor(Math.random() * 150000) + 80000
            },
            {
                id: 'world_athletics',
                name: 'World Athletics Championship',
                sport: 'Athletics',
                type: 'Athletics',
                tier: 'international',
                gender: 'F',
                url: 'https://www.youtube.com/embed/_LfB2RF5AkM',
                description: 'Women\'s 400m Hurdles Final',
                thumbnail: '/assets/thumb_athletics.png',
                viewers: Math.floor(Math.random() * 60000) + 30000
            },

            // ============ SWIMMING (5 streams) ============
            {
                id: 'local_swimming',
                name: 'District Swimming Championship',
                sport: 'Swimming',
                type: 'Swimming',
                tier: 'local',
                gender: 'F',
                url: 'https://www.youtube.com/embed/e1v9x_B8q2E',
                description: 'Junior Category Finals',
                thumbnail: '/assets/thumb_swimming.png',
                viewers: Math.floor(Math.random() * 400) + 100
            },
            {
                id: 'school_swimming',
                name: 'School Swimming Meet',
                sport: 'Swimming',
                type: 'Swimming',
                tier: 'local',
                gender: 'M',
                url: 'https://www.youtube.com/embed/e1v9x_B8q2E',
                description: 'Inter-School Competition',
                thumbnail: '/assets/thumb_swimming.png',
                viewers: Math.floor(Math.random() * 300) + 80
            },
            {
                id: 'national_swimming',
                name: 'National Aquatic Games',
                sport: 'Swimming',
                type: 'Swimming',
                tier: 'national',
                gender: 'M',
                url: 'https://www.youtube.com/embed/e1v9x_B8q2E',
                description: '200m Butterfly Final',
                thumbnail: '/assets/thumb_swimming.png',
                viewers: Math.floor(Math.random() * 5000) + 2000
            },
            {
                id: 'olympics_swimming',
                name: 'Olympics: 100m Freestyle',
                sport: 'Swimming',
                type: 'Swimming',
                tier: 'international',
                gender: 'F',
                url: 'https://www.youtube.com/embed/e1v9x_B8q2E',
                description: 'Paris 2024 • Women\'s Final',
                thumbnail: '/assets/thumb_swimming.png',
                viewers: Math.floor(Math.random() * 100000) + 50000
            },
            {
                id: 'world_swimming',
                name: 'World Swimming Championship',
                sport: 'Swimming',
                type: 'Swimming',
                tier: 'international',
                gender: 'M',
                url: 'https://www.youtube.com/embed/e1v9x_B8q2E',
                description: 'Men\'s Medley Relay',
                thumbnail: '/assets/thumb_swimming.png',
                viewers: Math.floor(Math.random() * 40000) + 20000
            },

            // ============ COMBAT SPORTS (5 streams) ============
            {
                id: 'club_kabaddi',
                name: 'Club Kabaddi League',
                sport: 'Kabaddi',
                type: 'Combat Sports',
                tier: 'local',
                gender: 'M',
                url: 'https://www.youtube.com/embed/3-5_f_kK-2U',
                description: 'Regional Club Showdown',
                thumbnail: '/assets/thumb_combat.png',
                viewers: Math.floor(Math.random() * 600) + 150
            },
            {
                id: 'local_boxing',
                name: 'District Boxing Championship',
                sport: 'Boxing',
                type: 'Combat Sports',
                tier: 'local',
                gender: 'M',
                url: 'https://www.youtube.com/embed/3-5_f_kK-2U',
                description: 'Amateur Boxing Finals',
                thumbnail: '/assets/thumb_combat.png',
                viewers: Math.floor(Math.random() * 500) + 200
            },
            {
                id: 'pro_kabaddi',
                name: 'Pro Kabaddi League',
                sport: 'Kabaddi',
                type: 'Combat Sports',
                tier: 'national',
                gender: 'M',
                url: 'https://www.youtube.com/embed/D-nUfS77i7Y',
                description: 'Season 10 • Playoffs',
                thumbnail: '/assets/thumb_combat.png',
                viewers: Math.floor(Math.random() * 5000) + 2000
            },
            {
                id: 'boxing_nationals',
                name: 'National Boxing Championship',
                sport: 'Boxing',
                type: 'Combat Sports',
                tier: 'national',
                gender: 'F',
                url: 'https://www.youtube.com/embed/_LfB2RF5AkM',
                description: 'Women\'s Flyweight Finals',
                thumbnail: '/assets/thumb_combat.png',
                viewers: Math.floor(Math.random() * 3000) + 1000
            },
            {
                id: 'ufc_fight',
                name: 'UFC Fight Night',
                sport: 'MMA',
                type: 'Combat Sports',
                tier: 'international',
                gender: 'M',
                url: 'https://www.youtube.com/embed/3-5_f_kK-2U',
                description: 'Main Event • Title Fight',
                thumbnail: '/assets/thumb_combat.png',
                viewers: Math.floor(Math.random() * 80000) + 40000
            },

            // ============ RACQUET SPORTS (5 streams) ============
            {
                id: 'district_badminton',
                name: 'District Badminton Open',
                sport: 'Badminton',
                type: 'Racquet Sports',
                tier: 'local',
                gender: 'F',
                url: 'https://www.youtube.com/embed/_LfB2RF5AkM',
                description: 'Women\'s Singles Final',
                thumbnail: '/assets/thumb_racquet.png',
                viewers: Math.floor(Math.random() * 350) + 80
            },
            {
                id: 'club_tennis',
                name: 'Tennis Club Championship',
                sport: 'Tennis',
                type: 'Racquet Sports',
                tier: 'local',
                gender: 'M',
                url: 'https://www.youtube.com/embed/_LfB2RF5AkM',
                description: 'Men\'s Doubles Final',
                thumbnail: '/assets/thumb_racquet.png',
                viewers: Math.floor(Math.random() * 400) + 100
            },
            {
                id: 'pbl_badminton',
                name: 'Premier Badminton League',
                sport: 'Badminton',
                type: 'Racquet Sports',
                tier: 'national',
                gender: 'M',
                url: 'https://www.youtube.com/embed/_LfB2RF5AkM',
                description: 'Team Championship Semi-Final',
                thumbnail: '/assets/thumb_racquet.png',
                viewers: Math.floor(Math.random() * 4000) + 1500
            },
            {
                id: 'wimbledon_final',
                name: 'Wimbledon Finals',
                sport: 'Tennis',
                type: 'Racquet Sports',
                tier: 'international',
                gender: 'M',
                url: 'https://www.youtube.com/embed/D-nUfS77i7Y',
                description: 'Men\'s Singles Championship',
                thumbnail: '/assets/thumb_racquet.png',
                viewers: Math.floor(Math.random() * 80000) + 30000
            },
            {
                id: 'all_england_badminton',
                name: 'All England Badminton',
                sport: 'Badminton',
                type: 'Racquet Sports',
                tier: 'international',
                gender: 'F',
                url: 'https://www.youtube.com/embed/_LfB2RF5AkM',
                description: 'Women\'s Singles Final',
                thumbnail: '/assets/thumb_racquet.png',
                viewers: Math.floor(Math.random() * 50000) + 25000
            },

            // ============ EXTREME SPORTS (5 streams) ============
            {
                id: 'local_skateboarding',
                name: 'Skatepark Showdown',
                sport: 'Skateboarding',
                type: 'Extreme Sports',
                tier: 'local',
                gender: 'M',
                url: 'https://www.youtube.com/embed/e1v9x_B8q2E',
                description: 'Local Park Competition',
                thumbnail: '/assets/thumb_extreme.png',
                viewers: Math.floor(Math.random() * 300) + 100
            },
            {
                id: 'bmx_local',
                name: 'BMX Street Challenge',
                sport: 'BMX',
                type: 'Extreme Sports',
                tier: 'local',
                gender: 'M',
                url: 'https://www.youtube.com/embed/e1v9x_B8q2E',
                description: 'City Street Championship',
                thumbnail: '/assets/thumb_extreme.png',
                viewers: Math.floor(Math.random() * 400) + 150
            },
            {
                id: 'x_games_india',
                name: 'X Games India',
                sport: 'Multiple',
                type: 'Extreme Sports',
                tier: 'national',
                gender: 'M',
                url: 'https://www.youtube.com/embed/e1v9x_B8q2E',
                description: 'National Extreme Sports',
                thumbnail: '/assets/thumb_extreme.png',
                viewers: Math.floor(Math.random() * 5000) + 2000
            },
            {
                id: 'wsl_surfing',
                name: 'WSL Championship Tour',
                sport: 'Surfing',
                type: 'Extreme Sports',
                tier: 'international',
                gender: 'F',
                url: 'https://www.youtube.com/embed/e1v9x_B8q2E',
                description: 'Pipeline Masters • Women\'s Final',
                thumbnail: '/assets/thumb_extreme.png',
                viewers: Math.floor(Math.random() * 20000) + 8000
            },
            {
                id: 'x_games_world',
                name: 'X Games World Championship',
                sport: 'Multiple',
                type: 'Extreme Sports',
                tier: 'international',
                gender: 'M',
                url: 'https://www.youtube.com/embed/e1v9x_B8q2E',
                description: 'Skateboard Big Air Finals',
                thumbnail: '/assets/thumb_extreme.png',
                viewers: Math.floor(Math.random() * 60000) + 30000
            }
        ];

        // Sport categories for filtering
        this.sports = [
            { id: 'all', name: 'All Sports' },
            { id: 'cricket', name: 'Cricket' },
            { id: 'football', name: 'Football' },
            { id: 'basketball', name: 'Basketball' },
            { id: 'athletics', name: 'Athletics' },
            { id: 'swimming', name: 'Swimming' },
            { id: 'combat', name: 'Combat Sports' },
            { id: 'racquet', name: 'Racquet Sports' },
            { id: 'extreme', name: 'Extreme Sports' }
        ];

        // Tier categories
        this.tiers = [
            { id: 'all', name: 'All Levels' },
            { id: 'local', name: 'Local' },
            { id: 'national', name: 'National' },
            { id: 'international', name: 'International' }
        ];
    }

    getWeightedStream(currentId = null) {
        const roll = Math.random();
        const targetGender = roll < 0.70 ? 'F' : 'M';
        let pool = this.allChannels.filter(c => c.gender === targetGender);
        if (pool.length === 0) {
            pool = this.allChannels.filter(c => c.gender === (targetGender === 'F' ? 'M' : 'F'));
        }
        let candidates = pool.filter(c => c.id !== currentId);
        if (candidates.length === 0) candidates = pool;
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    getChannels() { return this.allChannels; }
    getSports() { return this.sports; }
    getTiers() { return this.tiers; }

    getChannelsBySport(sport) {
        if (sport === 'all') return this.allChannels;
        return this.allChannels.filter(c =>
            c.sport.toLowerCase().includes(sport.toLowerCase()) ||
            c.type.toLowerCase().includes(sport.toLowerCase())
        );
    }

    getChannelsByTier(tier) {
        if (tier === 'all') return this.allChannels;
        return this.allChannels.filter(c => c.tier === tier);
    }

    getFilteredChannels(sportFilter = 'all', tierFilter = 'all') {
        return this.allChannels.filter(channel => {
            const sportMatch = sportFilter === 'all' ||
                channel.sport.toLowerCase().includes(sportFilter.toLowerCase()) ||
                channel.type.toLowerCase().includes(sportFilter.toLowerCase());
            const tierMatch = tierFilter === 'all' || channel.tier === tierFilter;
            return sportMatch && tierMatch;
        });
    }

    getChannelsGroupedBySport() {
        const grouped = {};
        this.sports.filter(s => s.id !== 'all').forEach(sport => {
            const channels = this.getChannelsBySport(sport.id);
            if (channels.length > 0) {
                grouped[sport.name] = channels;
            }
        });
        return grouped;
    }
}

export const liveStreamService = new LiveStreamService();
