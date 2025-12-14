import React from 'react';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import newsTraining from '../assets/news_training.png';
import newsChampionship from '../assets/news_championship.png';
import '../styles/components/NewsEvents.css';

const NewsEvents = () => {
    const news = [
        {
            id: 1,
            title: 'National Mixed-Gender Championship Final Tickets Live Now',
            date: 'Dec 20, 2025',
            image: newsChampionship,
            type: 'Event',
            desc: 'Witness history as the top mixed teams battle for the Golden Trophy. Limited seats available for the grand finale.'
        },
        {
            id: 2,
            title: 'State-of-the-Art Training Facility Opens in Downtown',
            date: 'Dec 18, 2025',
            image: newsTraining,
            type: 'News',
            desc: 'Our new high-performance center features AI-driven analytics, hybrid turf, and world-class recovery zones.'
        }
    ];

    return (
        <div className="news-container">
            <h2 className="section-title">News & Events</h2>

            <div className="news-grid">
                {news.map(item => (
                    <div key={item.id} className="news-card">
                        <div className="news-image">
                            <img src={item.image} alt={item.title} />
                            <span className="news-tag">{item.type}</span>
                        </div>
                        <div className="news-content">
                            <div className="news-date">
                                <Calendar size={14} /> {item.date}
                            </div>
                            <h3 className="news-title">{item.title}</h3>
                            <p className="news-desc">{item.desc}</p>
                            <button className="btn-ticket">
                                {item.type === 'Event' ? 'Get Tickets' : 'Read Full Story'} <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsEvents;
