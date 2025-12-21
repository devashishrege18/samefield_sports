import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  Users,
  MessageCircle,
  Phone,
  MoreVertical,
  Grid3X3,
  Focus,
  Settings,
  Copy,
  LogOut,
} from 'lucide-react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import '../styles/components/VideoConference.css';

const SOCKET_URL = 'http://localhost:3001';

const VideoConference = () => {
  // Video/Audio State
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'speaker'
  const [activeSpeaker, setActiveSpeaker] = useState(null);

  // WebRTC & Socket State
  const [socket, setSocket] = useState(null);
  const [guestIdentity, setGuestIdentity] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectError, setConnectError] = useState(null);

  // UI State
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const localVideoRef = useRef(null);
  const messagesEndRef = useRef(null);
  const meetingCode = useRef(uuidv4().slice(0, 8).toUpperCase());

  // Initialize Guest Identity & Socket Connection
  useEffect(() => {
    // Get or create guest identity
    let storedId = localStorage.getItem('video_guest_id');
    let storedName = localStorage.getItem('video_guest_name');

    if (!storedId) {
      storedId = uuidv4();
      storedName = `Participant_${Math.floor(1000 + Math.random() * 9000)}`;
      localStorage.setItem('video_guest_id', storedId);
      localStorage.setItem('video_guest_name', storedName);
    }

    const identity = { guest_id: storedId, guest_name: storedName };
    setGuestIdentity(identity);

    // Setup WebRTC local stream
    setupLocalStream();

    // Socket connection
    const newSocket = io(SOCKET_URL, {
      query: identity,
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      setConnectError(null);
      console.log('Connected to video conference');
      addSystemMessage('You joined the meeting');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket error:', err.message);
      setConnectError(err.message);
      setIsConnected(false);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Handle participants update
    newSocket.on('update_users', (users) => {
      const participantList = users.map((user) => ({
        id: user.socketId,
        name: user.name,
        isLocal: false,
        videoEnabled: true,
        audioEnabled: true,
      }));
      setParticipants(participantList);
      
      // Set first participant as active speaker if in speaker view
      if (participantList.length > 0 && !activeSpeaker) {
        setActiveSpeaker(participantList[0]);
      }
    });

    newSocket.on('user_joined', (user) => {
      addSystemMessage(`${user.guest_name} joined the meeting`);
    });

    newSocket.on('user_left', (user) => {
      addSystemMessage(`${user.guest_name} left the meeting`);
    });

    newSocket.on('receive_message', (msg) => {
      setChatMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Setup local video stream
  const setupLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setConnectError('Cannot access camera/microphone. Check permissions.');
    }
  };

  // Toggle microphone
  const toggleMic = () => {
    if (localVideoRef.current?.srcObject) {
      const audioTracks = localVideoRef.current.srcObject.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicEnabled(!isMicEnabled);
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    if (localVideoRef.current?.srcObject) {
      const videoTracks = localVideoRef.current.srcObject.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraEnabled(!isCameraEnabled);
    }
  };

  // Toggle screen share
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
        });
        
        if (localVideoRef.current) {
          const screenTrack = screenStream.getVideoTracks()[0];
          const videoTrack = localVideoRef.current.srcObject?.getVideoTracks()[0];
          
          if (videoTrack) {
            await videoTrack.replaceTrack(screenTrack);
          }
        }
        setIsScreenSharing(true);
        addSystemMessage('Screen sharing started');
      } else {
        setupLocalStream();
        setIsScreenSharing(false);
        addSystemMessage('Screen sharing stopped');
      }
    } catch (error) {
      console.error('Screen share error:', error);
    }
  };

  // Send chat message
  const handleSendMessage = () => {
    if (!socket || !chatInput.trim() || !guestIdentity) return;

    socket.emit('send_message', {
      guest_id: guestIdentity.guest_id,
      guest_name: guestIdentity.guest_name,
      text: chatInput,
    });

    setChatInput('');
  };

  // Add system message
  const addSystemMessage = (text) => {
    setChatMessages((prev) => [
      ...prev,
      {
        id: 'sys_' + Date.now(),
        type: 'system',
        text,
      },
    ]);
    scrollToBottom();
  };

  // Scroll chat to bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Leave meeting
  const handleLeaveMeeting = () => {
    if (socket) {
      socket.disconnect();
    }
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  // Copy meeting code
  const copyMeetingCode = () => {
    navigator.clipboard.writeText(meetingCode.current);
    alert('Meeting code copied!');
  };

  if (!guestIdentity) {
    return (
      <div className="video-loading">
        <div className="spinner"></div>
        <p>Initializing video conference...</p>
      </div>
    );
  }

  return (
    <div className="video-conference-container">
      {/* Main Video Area */}
      <div className="video-main-area">
        {connectError && (
          <div className="connection-error">
            <span>⚠️ {connectError}</span>
          </div>
        )}

        {/* Video Grid/Speaker View */}
        <div className={`video-content ${viewMode}`}>
          {viewMode === 'grid' ? (
            // Gallery Mode
            <div className="video-grid">
              {/* Remote Participants */}
              {participants.length > 0 ? (
                participants.map((participant) => (
                  <div
                    key={participant.id}
                    className={`video-tile ${activeSpeaker?.id === participant.id ? 'active' : ''}`}
                    onMouseEnter={() => setActiveSpeaker(participant)}
                  >
                    <div className="video-placeholder">
                      <div className="participant-avatar">
                        {participant.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="video-tile-info">
                      <span className="participant-name">{participant.name}</span>
                      <div className="video-tile-controls">
                        {!participant.audioEnabled && <MicOff size={14} />}
                        {!participant.videoEnabled && <VideoOff size={14} />}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-grid">
                  <p>Waiting for participants...</p>
                </div>
              )}

              {/* Local Video */}
              <div className="video-tile local">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="local-video"
                />
                <div className="video-tile-info">
                  <span className="participant-name">
                    {guestIdentity.guest_name} (You)
                  </span>
                  <div className="video-tile-controls">
                    {!isMicEnabled && <MicOff size={14} color="red" />}
                    {!isCameraEnabled && <VideoOff size={14} color="red" />}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Speaker Mode
            <div className="speaker-view">
              <div className="speaker-main">
                {activeSpeaker ? (
                  <div className="video-tile fullscreen">
                    <div className="video-placeholder">
                      <div className="participant-avatar large">
                        {activeSpeaker.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="video-tile-info">
                      <span className="participant-name">{activeSpeaker.name}</span>
                    </div>
                  </div>
                ) : (
                  <div className="video-tile fullscreen">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="local-video"
                    />
                    <div className="video-tile-info">
                      <span className="participant-name">
                        {guestIdentity.guest_name} (You)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnails Sidebar */}
              <div className="speaker-thumbnails">
                {/* Local Thumbnail */}
                <div
                  className="thumbnail-tile"
                  onClick={() => setActiveSpeaker(null)}
                >
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="thumbnail-video"
                  />
                  <span className="thumbnail-name">You</span>
                </div>

                {/* Remote Thumbnails */}
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="thumbnail-tile"
                    onClick={() => setActiveSpeaker(participant)}
                  >
                    <div className="thumbnail-placeholder">
                      {participant.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="thumbnail-name">{participant.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control Bar */}
      <div className="control-bar">
        <div className="controls-left">
          <div className="meeting-info">
            <span className="meeting-code">{meetingCode.current}</span>
          </div>
        </div>

        <div className="controls-center">
          {/* Mic Toggle */}
          <button
            className={`control-btn ${isMicEnabled ? '' : 'disabled'}`}
            onClick={toggleMic}
            title={isMicEnabled ? 'Mute' : 'Unmute'}
          >
            {isMicEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          {/* Camera Toggle */}
          <button
            className={`control-btn ${isCameraEnabled ? '' : 'disabled'}`}
            onClick={toggleCamera}
            title={isCameraEnabled ? 'Stop video' : 'Start video'}
          >
            {isCameraEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          {/* Screen Share */}
          <button
            className={`control-btn ${isScreenSharing ? 'active' : ''}`}
            onClick={toggleScreenShare}
            title="Share screen"
          >
            <Share2 size={20} />
          </button>

          {/* Participants */}
          <button
            className={`control-btn ${showParticipants ? 'active' : ''}`}
            onClick={() => setShowParticipants(!showParticipants)}
            title="Show participants"
          >
            <Users size={20} />
            <span className="badge">{participants.length + 1}</span>
          </button>

          {/* Chat */}
          <button
            className={`control-btn ${showChat ? 'active' : ''}`}
            onClick={() => setShowChat(!showChat)}
            title="Chat"
          >
            <MessageCircle size={20} />
          </button>

          {/* Leave Button */}
          <button
            className="control-btn leave-btn"
            onClick={handleLeaveMeeting}
            title="Leave meeting"
          >
            <Phone size={20} />
          </button>
        </div>

        <div className="controls-right">
          {/* View Mode Toggle */}
          <button
            className={`control-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Gallery view"
          >
            <Grid3X3 size={20} />
          </button>

          <button
            className={`control-btn ${viewMode === 'speaker' ? 'active' : ''}`}
            onClick={() => setViewMode('speaker')}
            title="Speaker view"
          >
            <Focus size={20} />
          </button>

          {/* Settings */}
          <button
            className="control-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            <Settings size={20} />
          </button>

          {/* More Options */}
          <button className="control-btn" title="More options">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Participants Sidebar */}
      {showParticipants && (
        <div className="sidebar participants-sidebar">
          <div className="sidebar-header">
            <h3>Participants ({participants.length + 1})</h3>
            <button onClick={() => setShowParticipants(false)}>✕</button>
          </div>

          <div className="participants-list">
            {/* Local Participant */}
            <div className="participant-item local-item">
              <div className="participant-info">
                <span className="participant-avatar">
                  {guestIdentity.guest_name.charAt(0).toUpperCase()}
                </span>
                <span className="participant-details">
                  <strong>{guestIdentity.guest_name}</strong>
                  <small>(You)</small>
                </span>
              </div>
              <div className="participant-controls">
                {isMicEnabled ? <Mic size={16} /> : <MicOff size={16} />}
                {isCameraEnabled ? <Video size={16} /> : <VideoOff size={16} />}
              </div>
            </div>

            {/* Remote Participants */}
            {participants.map((participant) => (
              <div key={participant.id} className="participant-item">
                <div className="participant-info">
                  <span className="participant-avatar">
                    {participant.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="participant-name">{participant.name}</span>
                </div>
                <div className="participant-controls">
                  {participant.audioEnabled ? (
                    <Mic size={16} />
                  ) : (
                    <MicOff size={16} />
                  )}
                  {participant.videoEnabled ? (
                    <Video size={16} />
                  ) : (
                    <VideoOff size={16} />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <button className="copy-btn" onClick={copyMeetingCode}>
              <Copy size={14} /> Copy Meeting Code
            </button>
          </div>
        </div>
      )}

      {/* Chat Sidebar */}
      {showChat && (
        <div className="sidebar chat-sidebar">
          <div className="sidebar-header">
            <h3>Chat</h3>
            <button onClick={() => setShowChat(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {chatMessages.map((msg, idx) => {
              if (msg.type === 'system') {
                return (
                  <div key={idx} className="system-message">
                    <span className="system-text">{msg.text}</span>
                  </div>
                );
              }
              const isMe = msg.guest_id === guestIdentity.guest_id;
              return (
                <div key={idx} className={`chat-message ${isMe ? 'me' : 'them'}`}>
                  <span className="message-sender">{msg.guest_name}</span>
                  <div className="message-bubble">{msg.text}</div>
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Send a message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && handleSendMessage()
              }
            />
            <button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!chatInput.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-modal">
          <div className="settings-content">
            <div className="settings-header">
              <h3>Settings</h3>
              <button onClick={() => setShowSettings(false)}>✕</button>
            </div>

            <div className="settings-body">
              <div className="settings-section">
                <h4>Audio</h4>
                <label>
                  Microphone:
                  <select>
                    <option>Default</option>
                  </select>
                </label>
              </div>

              <div className="settings-section">
                <h4>Video</h4>
                <label>
                  Camera:
                  <select>
                    <option>Default</option>
                  </select>
                </label>
              </div>

              <div className="settings-section">
                <h4>Display</h4>
                <label>
                  <input type="checkbox" defaultChecked /> Show names on video
                </label>
                <label>
                  <input type="checkbox" defaultChecked /> Show participant list
                </label>
              </div>
            </div>

            <div className="settings-footer">
              <button
                className="close-btn"
                onClick={() => setShowSettings(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConference;
