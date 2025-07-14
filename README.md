# TeenRewards - Daily Activity & Goal Tracking App

## Overview
TeenRewards is a modern, pastel-themed Progressive Web App (PWA) designed to help users track daily activities, set goals, manage rewards, and maintain notes and mood tracking. Built with vanilla JavaScript, HTML, and CSS, it provides a beautiful, responsive interface optimized for mobile devices with a phone-only view design.

**Phone-Only Design!**
- Modern mobile-first interface with a clean, phone-optimized layout
- Settings panel that replaces the main view for seamless navigation
- Interactive goal management with click-to-edit functionality
- Beautiful pastel color scheme with smooth animations

## ✨ Key Features

### 🎯 Activity & Goal Management
- **Custom Activities**: Create and edit personalized activities with custom icons and point values
- **Goal Setting**: Mark specific activities as goals for focused achievement
- **My Goals Section**: Dedicated goals display above regular activities with distinct pink color scheme
- **Point System**: Earn points (5-50) for completing activities
- **Daily Tracking**: Track completed activities with timestamps
- **Activity Editor**: Full CRUD operations with visual preview and icon picker
- **Click-to-Edit Goals**: Click on goal numbers in the summary bar to edit them directly

### 📊 Dashboard & Progress
- **Real-time Progress**: Visual progress bars for daily and weekly goals
- **Mood Tracking**: Daily mood rating system (1-10 scale) with interactive slider
- **Notes System**: Daily note-taking with date-specific storage
- **Goals Display**: Visual list of current goals with checkmarks
- **Week Type Customization**: Choose between Monday-Sunday or Monday-Friday for weekly calculations
- **Mobile-Optimized Layout**: Responsive design optimized for phone screens

### 📱 Settings & Customization
- **Modern Settings Panel**: Clean, card-based settings interface that replaces the main view
- **User Profile**: Customizable name settings with "My Name" field
- **Activity Management**: Click any activity row to edit (no separate edit buttons)
- **Compact Design**: Streamlined interface with reduced spacing and hidden redundant elements
- **Smart Navigation**: Settings and Back to Main buttons positioned side-by-side
- **Auto-scroll**: Automatically scrolls to top when switching between views

### 🔄 Sharing & Export
- **Multiple Export Options**: Single day or date range reports
- **Native Sharing**: Share via device's native share functionality
- **Enhanced SMS Integration**: Share reports with images via SMS using multiple fallback methods
- **Image Export**: Generate beautiful, shareable activity cards with pastel themes
- **Clipboard Support**: Copy images directly to clipboard
- **Smart Image Sharing**: Automatic image attachment with native sharing, clipboard copy, or download guides

### 🔄 Data Management
- **Local Storage**: All data stored locally for privacy
- **Offline Support**: Full functionality without internet connection
- **History Tracking**: Complete activity and mood history with expandable details
- **Data Persistence**: Automatic saving of all user data
- **Date Navigation**: Browse historical data with date picker and load functionality

## 🚀 How to Run as a PWA

### 1. Serve the App from a Local or Public Server
- **Important**: You must serve the app over HTTP/HTTPS (not open `index.html` directly) for PWA features to work.
- Use any local server (Python, Node.js, etc.) or deploy to a public host (Netlify, Vercel, GitHub Pages).

#### Local Server Options

**Python 3:**
```sh
python -m http.server 8000
```
Then access at `http://localhost:8000`

**Node.js:**
```sh
npx serve .
```

### 2. Access from Your Phone (Optional)
- Ensure your phone is on the same Wi-Fi as your PC
- Find your PC's local IP address (e.g., `192.168.1.5`)
- On your phone, open Chrome and navigate to `http://<your-pc-ip>:8000`

### 3. Install as a Home Screen App (PWA)
- In Chrome (or Edge) on your phone, open the app URL
- Tap the three-dot menu and select **"Add to Home screen"** or **"Install app"**
- The app will appear on your home screen and function like a native app

### 4. Use the App Offline
- After installation, launch the app from your home screen icon
- All features work offline thanks to service worker caching

## 🛠 Technical Details

### Service Worker & Manifest
- **Service Worker**: Caches all core files for offline functionality
- **Web App Manifest**: Provides app name, icon, and installability features
- **Cache Management**: Update cache name in `service-worker.js` to force new file downloads

### File Structure
```
TeenRewardsNew/
├── index.html          # Main app interface (phone-only view)
├── styles.css          # Responsive styling with mobile optimizations
├── rewards.js          # Core app logic and functionality
├── service-worker.js   # PWA offline support
├── manifest.json       # App installation metadata
└── README.md          # This documentation
```

### Recent Major Improvements
- **Phone-Only Design**: Complete redesign focused on mobile experience with clean, modern interface
- **My Goals Section**: New dedicated goals display above activities with distinct pink color scheme
- **Streamlined Settings**: Modern card-based settings panel that replaces main view
- **Click-to-Edit Goals**: Interactive goal number editing directly in the summary bar
- **Activity Row Clicking**: Click entire activity rows to edit (removed separate edit buttons)
- **Compact Interface**: Removed redundant headings and reduced spacing for cleaner look
- **Smart Navigation**: Side-by-side Settings and Back to Main buttons
- **Auto-scroll**: Automatic scrolling to top when switching views
- **Enhanced Notes**: Improved visibility with better contrast and typography
- **Goal Management**: Visual distinction between goals and regular activities

## 🎨 Design Features

### Visual Design
- **Pastel Color Scheme**: Soft, calming colors with gradients
- **Modern UI Elements**: Rounded corners, subtle shadows, and smooth transitions
- **Mobile-First Layout**: Optimized for phone screens with touch-friendly elements
- **Interactive Elements**: Hover effects, focus states, and smooth animations
- **Color-Coded Sections**: Different colors for goals (pink), activities (blue), and accomplishments (green)

### User Experience
- **Intuitive Navigation**: Clear buttons and smooth transitions between views
- **Visual Feedback**: Progress bars, checkmarks, and status indicators
- **Accessibility**: Keyboard navigation and screen reader support
- **Touch-Friendly**: Optimized for mobile touch interactions
- **Clean Interface**: Minimal clutter with focused functionality

## 🔧 Troubleshooting

### Common Issues
- **PWA not installing**: Ensure you're serving over HTTP/HTTPS, not opening files directly
- **Changes not appearing**: Clear browser cache or increment service worker cache version
- **Mobile display issues**: Refresh the page and ensure you're using the latest version
- **SMS sharing not working**: Try the alternative sharing methods provided in the app

### Browser Compatibility
- **Chrome/Edge**: Full PWA support with all features
- **Safari**: PWA support with some limitations on sharing features
- **Firefox**: Good support for most features
- **Mobile Browsers**: Optimized for Chrome Mobile and Safari Mobile

## 📱 Mobile Features

### Optimized for Mobile
- **Phone-Only Design**: Interface specifically designed for mobile devices
- **Touch-Friendly Interface**: Large buttons and easy-to-tap elements
- **Responsive Design**: Adapts to different screen sizes and orientations
- **Mobile Sharing**: Enhanced sharing options specifically for mobile devices
- **Offline Functionality**: Works completely offline once installed
- **Home Screen Installation**: Install as a native app on your phone

### Mobile-Specific Features
- **Goals Section**: Dedicated display for goal activities with distinct styling
- **Settings Panel**: Full-screen settings that replace main view
- **Click-to-Edit**: Interactive editing of goals and activities
- **Auto-scroll**: Automatic navigation to top of page
- **Compact Layout**: Optimized spacing and typography for mobile screens

## 🚀 Future Enhancements

### Planned Features
- **Data Export/Import**: Backup and restore functionality
- **Cloud Sync**: Optional cloud storage for data backup
- **Advanced Analytics**: Detailed progress tracking and insights
- **Social Features**: Share achievements with friends and family
- **Custom Themes**: Additional color schemes and personalization options
- **Goal Streaks**: Track consecutive days of goal completion
- **Weekly Reports**: Enhanced weekly progress summaries

---

**TeenRewards** - Empowering daily progress with beautiful, intuitive tracking.
