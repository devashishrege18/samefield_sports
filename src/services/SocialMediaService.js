// Social Media Integration Service
// Real Reddit API + Mock Instagram/Twitter Data

// Reddit API - Free, no auth required for public posts
const REDDIT_BASE_URL = 'https://www.reddit.com';

// Subreddits mapped to circle topics
const SUBREDDIT_MAP = {
    'c1': ['Cricket', 'WomensCricket'], // Smriti Mandhana FC
    'c2': ['Cricket', 'IPL'], // MI Paltan (W)
    'c3': ['nba', 'wnba'], // Caitlin Clark Hype
    'c4': ['soccer', 'LionessesEngland'], // Lionesses
    'c5': ['Cricket', 'ViratKohli'], // Viratians
    'c6': ['tennis', 'WTA'], // Serena Legacy
    'default': ['sports', 'Athletics']
};

// Fetch real Reddit posts
export const fetchRedditPosts = async (circleId = 'default', limit = 8) => {
    const subreddits = SUBREDDIT_MAP[circleId] || SUBREDDIT_MAP['default'];
    const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];

    try {
        const response = await fetch(
            `${REDDIT_BASE_URL}/r/${subreddit}/hot.json?limit=${limit}`,
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        if (!response.ok) throw new Error('Reddit API failed');

        const data = await response.json();

        return data.data.children
            .filter(post => !post.data.stickied) // Filter out stickied posts
            .map(post => ({
                id: post.data.id,
                platform: 'reddit',
                subreddit: `r/${post.data.subreddit}`,
                title: post.data.title,
                author: `u/${post.data.author}`,
                upvotes: post.data.ups,
                comments: post.data.num_comments,
                url: `https://reddit.com${post.data.permalink}`,
                thumbnail: post.data.thumbnail?.startsWith('http') ? post.data.thumbnail : null,
                timeAgo: getTimeAgo(post.data.created_utc * 1000),
                isNsfw: post.data.over_18
            }))
            .filter(post => !post.isNsfw); // Filter NSFW
    } catch (error) {
        console.error('Reddit fetch error:', error);
        return getFallbackRedditPosts(circleId);
    }
};

// Fallback Reddit posts if API fails
const getFallbackRedditPosts = (circleId) => {
    const fallbackPosts = {
        'c1': [
            { id: 'fb1', platform: 'reddit', subreddit: 'r/Cricket', title: 'Smriti Mandhana masterclass innings breakdown', author: 'u/CricketAnalyst', upvotes: 1542, comments: 234, timeAgo: '3h' },
            { id: 'fb2', platform: 'reddit', subreddit: 'r/WomensCricket', title: 'Best cover drives in womens cricket - Smriti tops the list', author: 'u/WPLFan', upvotes: 892, comments: 156, timeAgo: '5h' }
        ],
        'c5': [
            { id: 'fb3', platform: 'reddit', subreddit: 'r/Cricket', title: 'Kohli century compilation - Pure class', author: 'u/ViratFan18', upvotes: 3421, comments: 567, timeAgo: '2h' },
            { id: 'fb4', platform: 'reddit', subreddit: 'r/ViratKohli', title: 'Training session pics from today', author: 'u/RCBSupporter', upvotes: 2156, comments: 342, timeAgo: '4h' }
        ],
        'default': [
            { id: 'fb5', platform: 'reddit', subreddit: 'r/sports', title: 'Greatest underdog victories in sports history', author: 'u/SportsNerd', upvotes: 5632, comments: 823, timeAgo: '1h' },
            { id: 'fb6', platform: 'reddit', subreddit: 'r/sports', title: 'Athletes who changed their sport forever', author: 'u/HistoryOfSports', upvotes: 4521, comments: 612, timeAgo: '6h' }
        ]
    };
    return fallbackPosts[circleId] || fallbackPosts['default'];
};

// Mock Instagram posts - Curated with unique, sport-relevant images
export const getInstagramPosts = (circleId = 'default') => {
    const instagramData = {
        'c1': [ // Smriti Mandhana - Women's Cricket (WPL)
            { id: 'ig1', platform: 'instagram', username: '@smikidzz', verified: true, avatar: 'SM', image: '/assets/wpl_abstract.png', caption: 'Match day ready! 🏏💪 Nothing beats the feeling of walking out to bat. #TeamIndia #WPL', likes: 154200, comments: 3420, timeAgo: '2h' },
            { id: 'ig2', platform: 'instagram', username: '@smikidzz', verified: true, avatar: 'SM', image: '/assets/cricket_equipment.png', caption: 'Training never stops! Early morning session done ✅ #Grind #Cricket', likes: 98500, comments: 1823, timeAgo: '5h' },
            { id: 'ig3', platform: 'instagram', username: '@wpl_official', verified: true, avatar: 'WP', image: '/assets/cricket_stadium_empty.png', caption: 'The elegance, the power, the grace. Our Queen of Cricket! 👑 @smikidzz #WPL2024', likes: 245000, comments: 5621, timeAgo: '1d' }
        ],
        'c2': [ // MI Paltan Women - Cricket/WPL
            { id: 'ig11', platform: 'instagram', username: '@mumbaiindians', verified: true, avatar: 'MI', image: '/assets/cricket_stadium_empty.png', caption: 'The Paltan spirit! 💙 Ready for battle! #MumbaiIndians #WPL', likes: 345000, comments: 8920, timeAgo: '3h' },
            { id: 'ig12', platform: 'instagram', username: '@wpl_official', verified: true, avatar: 'WP', image: '/assets/wpl_abstract.png', caption: 'Behind the scenes at training 📸 #MIPaltan #Cricket', likes: 234000, comments: 5621, timeAgo: '6h' }
        ],
        'c3': [ // Caitlin Clark - Basketball
            { id: 'ig7', platform: 'instagram', username: '@caitlinclark22', verified: true, avatar: 'CC', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop', caption: 'Game day energy ⚡🏀 Lets get this W! #WNBA #FeverRising', likes: 567000, comments: 12340, timeAgo: '4h' },
            { id: 'ig8', platform: 'instagram', username: '@wnba', verified: true, avatar: 'WN', image: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=400&h=400&fit=crop', caption: 'Caitlin Clark is DIFFERENT. 🔥 #WNBA #Fever', likes: 892000, comments: 34500, timeAgo: '8h' },
            { id: 'ig13', platform: 'instagram', username: '@caitlinclark22', verified: true, avatar: 'CC', image: 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=400&h=400&fit=crop', caption: 'Nothing like the roar of the crowd 🙌 Thank you Fever Nation!', likes: 723000, comments: 18900, timeAgo: '1d' }
        ],
        'c4': [ // Lionesses - Soccer/Football
            { id: 'ig14', platform: 'instagram', username: '@lionesses', verified: true, avatar: 'LI', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop', caption: 'Three Lions on the shirt 🦁🦁🦁 #Lionesses #EnglandFootball', likes: 456000, comments: 9870, timeAgo: '2h' },
            { id: 'ig15', platform: 'instagram', username: '@wlosl', verified: true, avatar: 'WS', image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&h=400&fit=crop', caption: 'Match day vibes! ⚽ Ready to roar!', likes: 234000, comments: 5430, timeAgo: '5h' },
            { id: 'ig16', platform: 'instagram', username: '@lionesses', verified: true, avatar: 'LI', image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=400&fit=crop', caption: 'Champions mentality 🏆 #Lionesses', likes: 678000, comments: 12340, timeAgo: '1d' }
        ],
        'c5': [ // Virat Kohli - Cricket
            { id: 'ig4', platform: 'instagram', username: '@virat.kohli', verified: true, avatar: 'VK', image: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=400&h=400&fit=crop', caption: 'Fitness is not about being better than someone else. Its about being better than you used to be. 💪', likes: 2450000, comments: 45210, timeAgo: '3h' },
            { id: 'ig5', platform: 'instagram', username: '@virat.kohli', verified: true, avatar: 'VK', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400&h=400&fit=crop', caption: '71 and counting. The journey continues! 🙏 #TeamIndia', likes: 3521000, comments: 78900, timeAgo: '1d' },
            { id: 'ig6', platform: 'instagram', username: '@rcb', verified: true, avatar: 'RC', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=400&fit=crop', caption: 'The King is here! 👑 @virat.kohli #PlayBold #IPL2024', likes: 890000, comments: 23400, timeAgo: '2d' }
        ],
        'c6': [ // Serena Legacy - Tennis
            { id: 'ig17', platform: 'instagram', username: '@serenawilliams', verified: true, avatar: 'SW', image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=400&fit=crop', caption: 'Every champion was once a contender that refused to give up 🎾👑', likes: 1234000, comments: 34560, timeAgo: '4h' },
            { id: 'ig18', platform: 'instagram', username: '@wta', verified: true, avatar: 'WT', image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=400&fit=crop', caption: 'Legends of the court 🏆 #WTA #Tennis', likes: 567000, comments: 12340, timeAgo: '8h' },
            { id: 'ig19', platform: 'instagram', username: '@serenawilliams', verified: true, avatar: 'SW', image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&h=400&fit=crop', caption: 'Game. Set. Match. 🎾💪', likes: 2345000, comments: 56780, timeAgo: '1d' }
        ],
        'default': [
            { id: 'ig9', platform: 'instagram', username: '@espn', verified: true, avatar: 'ES', image: 'https://images.unsplash.com/photo-1461896836934- voices-de83a5d00?w=400&h=400&fit=crop', caption: 'The greatest athletes inspire us all. Who inspires you? 🏆', likes: 345000, comments: 8900, timeAgo: '6h' },
            { id: 'ig10', platform: 'instagram', username: '@sportscenter', verified: true, avatar: 'SC', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=400&fit=crop', caption: 'Top 10 plays of the week! 🔥 Which one is your favorite?', likes: 567000, comments: 12300, timeAgo: '12h' },
            { id: 'ig20', platform: 'instagram', username: '@olympics', verified: true, avatar: 'OL', image: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=400&h=400&fit=crop', caption: 'Celebrating the spirit of sport 🥇 #Olympics', likes: 890000, comments: 23400, timeAgo: '1d' }
        ]
    };
    return instagramData[circleId] || instagramData['default'];
};

// Mock Twitter/X posts - Curated to look realistic
export const getTwitterPosts = (circleId = 'default') => {
    const twitterData = {
        'c1': [
            { id: 'tw1', platform: 'twitter', username: '@smikidzz', verified: true, avatar: 'SM', content: 'What a game today! So grateful for all the support from the fans. You make every moment special 🙏💙 #WPL #CricketTwitter', retweets: 8500, likes: 45200, timeAgo: '1h' },
            { id: 'tw2', platform: 'twitter', username: '@BCCIWomen', verified: true, avatar: 'BC', content: '🚨 BREAKING: @smikidzz scores her fastest T20 fifty! The elegance, the timing, the class! 🏏🔥 #WPL2024', retweets: 12400, likes: 78900, timeAgo: '3h' },
            { id: 'tw3', platform: 'twitter', username: '@WisdenCricket', verified: true, avatar: 'WC', content: 'Smriti Mandhana is redefining womens cricket. Her cover drive is pure poetry. 📝✨', retweets: 5600, likes: 34500, timeAgo: '6h' }
        ],
        'c5': [
            { id: 'tw4', platform: 'twitter', username: '@imVkohli', verified: true, avatar: 'VK', content: 'Hard work beats talent when talent doesnt work hard. Never stop grinding! 💪🔥', retweets: 45000, likes: 234000, timeAgo: '2h' },
            { id: 'tw5', platform: 'twitter', username: '@BCCI', verified: true, avatar: 'BC', content: '👑 @imVkohli crosses 27,000 international runs! Absolute GOAT! 🐐🇮🇳 #TeamIndia', retweets: 89000, likes: 456000, timeAgo: '5h' },
            { id: 'tw6', platform: 'twitter', username: '@CricketAus', verified: true, avatar: 'CA', content: 'Kohli vs Australia. Every. Single. Time. 🔥 What a player!', retweets: 23400, likes: 123000, timeAgo: '1d' }
        ],
        'c3': [
            { id: 'tw7', platform: 'twitter', username: '@CaitlinClark22', verified: true, avatar: 'CC', content: 'Another day, another opportunity to compete. Lets get it! 🏀⚡ #FeverRising', retweets: 12300, likes: 89000, timeAgo: '3h' },
            { id: 'tw8', platform: 'twitter', username: '@WNBA', verified: true, avatar: 'WN', content: '🚨 CAITLIN CLARK BREAKS ANOTHER RECORD! Most assists by a rookie in WNBA history! 📊🔥', retweets: 34500, likes: 178000, timeAgo: '6h' }
        ],
        'default': [
            { id: 'tw9', platform: 'twitter', username: '@espaborealz', verified: true, avatar: 'ES', content: 'Sports bring us together. No matter who you root for, we can all appreciate greatness. 🏆', retweets: 8900, likes: 56700, timeAgo: '4h' },
            { id: 'tw10', platform: 'twitter', username: '@SportsCenter', verified: true, avatar: 'SC', content: 'The top 5 moments that defined this season! 🎬 Which one gave you chills?', retweets: 12300, likes: 78900, timeAgo: '8h' }
        ]
    };
    return twitterData[circleId] || twitterData['default'];
};

// Helper: Get time ago string
const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return `${Math.floor(seconds / 604800)}w`;
};

// Format large numbers (1000 -> 1K, 1000000 -> 1M)
export const formatCount = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

export default {
    fetchRedditPosts,
    getInstagramPosts,
    getTwitterPosts,
    formatCount
};
