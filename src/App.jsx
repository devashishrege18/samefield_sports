import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import LiveMatches from './components/LiveMatches';
import Commentary from './components/Commentary';
import Fandom from './components/Fandom';
import VideoConference from './components/VideoConference';
import KID from './components/KID';
import PlayerMeet from './components/PlayerMeet';
import Highlights from './components/Highlights';
import Forum from './components/Forum';
import NewsEvents from './components/NewsEvents';
import MixedSportsHero from './components/MixedSportsHero';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="app-container">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        {activeTab === 'home' && (
          <div className="scroll-container">
            <Hero />
            <MixedSportsHero />
            <LiveMatches />
            <Fandom />
            <Highlights />
            <NewsEvents />
          </div>
        )}
        {activeTab === 'matches' && (
          <div className="page-content">
            <LiveMatches />
            <Commentary />
          </div>
        )}
        {activeTab === 'fandom' && <Fandom />}
        {activeTab === 'highlights' && <Highlights />}
        {activeTab === 'kid' && <KID />}
        {activeTab === 'meet' && <VideoConference />}
        {activeTab === 'forum' && <Forum />}
        {activeTab === 'news' && <NewsEvents />}
      </main>
    </div>
  );
}

export default App;
