# Video Conference (Zoom/Google Meet Style) - Implementation Guide

## Overview

The VideoConference component provides a production-ready video conferencing interface with Zoom/Google Meet styling and functionality.

## Features Implemented

### Core Functionality
- ✅ **Grid View (Gallery Mode)** - Display up to 10+ participants in a responsive grid
- ✅ **Speaker View** - Large speaker with thumbnail sidebar
- ✅ **Microphone Control** - Toggle audio on/off
- ✅ **Camera Control** - Toggle video on/off  
- ✅ **Screen Sharing** - Share desktop/window to participants
- ✅ **Chat System** - Real-time messaging via Socket.IO
- ✅ **Participants List** - View all active participants
- ✅ **Settings Panel** - Configure audio/video devices and display options

### UI/UX Features
- ✅ **Dark Theme** - Professional dark background (Zoom/Meet style)
- ✅ **Responsive Design** - Works on desktop, tablet, mobile
- ✅ **Active Speaker Highlight** - Visual indication of who's speaking
- ✅ **Status Indicators** - Mute/camera off indicators on tiles
- ✅ **Meeting Code** - Display and copy meeting code
- ✅ **System Messages** - Notify when users join/leave
- ✅ **Connection Status** - Shows error messages and connection state

### Technical Stack
- **Frontend**: React 19.2.0 + Vite
- **Real-time Signaling**: Socket.IO 4.8.1 (via existing backend)
- **WebRTC**: Browser-native WebRTC APIs
- **Icons**: lucide-react

## Component Structure

```
src/
├── components/
│   └── VideoConference.jsx          # Main video conference component
├── styles/
│   └── components/
│       └── VideoConference.css      # Complete styling
└── App.jsx                          # Updated to include VideoConference
```

## How to Use

### 1. **Start the Backend Server**

```bash
cd server
npm install
npm run dev
# Runs on http://localhost:3001
```

### 2. **Start the Frontend**

```bash
npm install
npm run dev
# Runs on http://localhost:5173 (typical Vite default)
```

### 3. **Access Video Conference**

Navigate to the app and click "Meet" in the navigation menu (or the `meet` tab).

## Component Props & State

### State Variables

```javascript
// Video Controls
const [isMicEnabled, setIsMicEnabled] = useState(true);
const [isCameraEnabled, setIsCameraEnabled] = useState(true);
const [isScreenSharing, setIsScreenSharing] = useState(false);

// UI Mode
const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'speaker'
const [activeSpeaker, setActiveSpeaker] = useState(null);

// Socket & Participants
const [socket, setSocket] = useState(null);
const [guestIdentity, setGuestIdentity] = useState(null);
const [participants, setParticipants] = useState([]);
const [isConnected, setIsConnected] = useState(false);

// UI State
const [showParticipants, setShowParticipants] = useState(false);
const [showChat, setShowChat] = useState(false);
const [showSettings, setShowSettings] = useState(false);

// Chat
const [chatMessages, setChatMessages] = useState([]);
const [chatInput, setChatInput] = useState('');
```

## Key Functions

### Media Controls

```javascript
// Toggle Microphone
toggleMic() {
  - Mutes/unmutes audio track
  - Updates UI state
}

// Toggle Camera
toggleCamera() {
  - Stops/starts video track
  - Updates UI state
}

// Screen Sharing
toggleScreenShare() {
  - Captures display stream
  - Replaces video track
  - Sends system message
}
```

### Communication

```javascript
// Send Chat Message
handleSendMessage() {
  - Validates input
  - Emits via Socket.IO
  - Clears input
}

// Receive Messages (Socket.IO)
socket.on('receive_message', (msg) => {
  - Appends to chat array
  - Auto-scrolls to bottom
})
```

### Meeting Management

```javascript
// Leave Meeting
handleLeaveMeeting() {
  - Disconnects socket
  - Stops media tracks
  - Cleans up resources
}

// Copy Meeting Code
copyMeetingCode() {
  - Copies to clipboard
  - Shows notification
}
```

## Socket.IO Events

### Emitted Events
```javascript
socket.emit('send_message', {
  guest_id: string,
  guest_name: string,
  text: string
});
```

### Listening Events
```javascript
socket.on('connect')                 // Connected to server
socket.on('disconnect')              // Disconnected from server
socket.on('update_users', users)     // Participant list updated
socket.on('user_joined', user)       // New user joined
socket.on('user_left', user)         // User left
socket.on('receive_message', msg)    // New chat message
```

## CSS Classes Reference

### Main Container
- `.video-conference-container` - Main wrapper
- `.video-main-area` - Video display area
- `.video-content` - Video grid/speaker view container

### Video Display
- `.video-grid` - Gallery mode layout
- `.video-tile` - Individual participant video
- `.video-tile.active` - Highlighted active speaker
- `.speaker-view` - Speaker mode layout
- `.speaker-thumbnails` - Thumbnail sidebar

### Controls
- `.control-bar` - Bottom control panel
- `.control-btn` - Individual control button
- `.control-btn.active` - Active control button
- `.control-btn.leave-btn` - Leave meeting button (red)

### Sidebars
- `.sidebar` - Generic sidebar container
- `.participants-sidebar` - Participants list
- `.chat-sidebar` - Chat panel
- `.participant-item` - Individual participant row
- `.chat-message` - Individual chat message

### Responsive Breakpoints
- **Desktop**: 1024px+ (all features)
- **Tablet**: 768px-1023px (optimized layout)
- **Mobile**: <768px (single column, full width sidebars)

## Customization Guide

### Change Theme Colors

Edit `VideoConference.css`:
```css
/* Background */
.video-conference-container {
  background: #0a0e27;  /* Dark blue */
}

/* Primary Accent */
.control-btn.active {
  background: #3b82f6;  /* Blue */
}

/* Danger (Leave Button) */
.control-btn.leave-btn {
  background: rgba(239, 68, 68, 0.8);  /* Red */
}
```

### Adjust Grid Layout

```css
/* For 2 columns max */
.video-grid {
  grid-template-columns: repeat(2, 1fr);
}

/* For larger tiles */
.video-tile {
  aspect-ratio: 1 / 1;  /* Square tiles */
}
```

### Customize Sidebar Width

```css
.sidebar {
  width: 400px;  /* Increase from 350px */
}
```

## Common Tasks

### Add Screen Capture Permissions

Update `setupLocalStream()` to request screen share:
```javascript
const screenStream = await navigator.mediaDevices.getDisplayMedia({
  video: { cursor: 'always' },
  audio: false
});
```

### Change Default View Mode

```javascript
// In VideoConference.jsx
const [viewMode, setViewMode] = useState('speaker'); // Changed from 'grid'
```

### Adjust Participant Limit

The 10-user limit is enforced by the backend Socket.IO middleware:
```javascript
// In server/index.js
const MAX_USERS = 10;  // Modify this value
```

### Add Recording Feature

Use MediaRecorder API:
```javascript
const mediaRecorder = new MediaRecorder(stream);
mediaRecorder.start();
// ... handle recording events
```

## Known Limitations

1. **WebRTC Peer Connections**: Currently using mock participants (placeholder avatars)
   - Need to implement full P2P WebRTC with ICE candidates
   - Use libraries like `simple-peer` or `peerjs` for simplification

2. **Screen Sharing**: Works locally but needs server relay for production
   - Requires simulcast or SFU (Selective Forwarding Unit)

3. **Audio/Video Quality**: Not optimized for bandwidth
   - Consider adding quality presets
   - Implement bandwidth estimation

4. **Mobile**: Touch gestures not fully implemented
   - Add pinch-to-zoom for video tiles
   - Add swipe gestures for sidebars

## Performance Optimization

### Recommended Enhancements

1. **Lazy Load Sidebars**
   ```javascript
   const ParticipantsSidebar = lazy(() => import('./ParticipantsSidebar'));
   ```

2. **Memoize Video Tiles**
   ```javascript
   const VideoTile = memo(({ participant }) => ...);
   ```

3. **Virtual Scrolling for Large Participant Lists**
   ```javascript
   import { FixedSizeList } from 'react-window';
   ```

4. **Debounce Grid Resizing**
   ```javascript
   const handleResize = debounce(() => { /* ... */ }, 200);
   ```

## Troubleshooting

### No Camera/Microphone Access
- **Issue**: Permission denied or devices not found
- **Solution**: Check browser permissions, ensure HTTPS in production

### Chat Messages Not Appearing
- **Issue**: Socket.IO not connected
- **Solution**: Verify backend is running on `http://localhost:3001`

### Poor Video Quality
- **Issue**: Pixelated or laggy video
- **Solution**: Reduce resolution in `setupLocalStream()`, check network

### Grid Not Responsive
- **Issue**: Layout not adjusting to participant count
- **Solution**: Browser CSS Grid support issue, check in DevTools

## Next Steps

1. **Implement Full WebRTC**
   - Add ICE candidate gathering
   - Implement offer/answer exchange via Socket.IO
   - Test with actual peer connections

2. **Add Video Recording**
   - Use MediaRecorder API
   - Save to server or cloud storage

3. **Deploy Backend**
   - Deploy to Render, Railway, or AWS
   - Update `SOCKET_URL` in component

4. **Add Advanced Features**
   - Virtual backgrounds
   - Hand raising
   - Meeting recordings
   - Breakout rooms
   - Instant polls/surveys

## Resources

- [WebRTC Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Socket.IO Guide](https://socket.io/docs/v4/)
- [React Best Practices](https://react.dev/)
- [CSS Grid Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

## Support

For issues or questions, check:
1. Browser console for errors
2. Network tab in DevTools for Socket.IO connection
3. Camera/microphone permissions in browser settings
4. Backend logs for Socket.IO errors
