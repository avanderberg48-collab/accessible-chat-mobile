# AccessChat Mobile - React Native Android App

A fully accessible real-time chat application for blind users, built with React Native and Expo.

## Features

### Core Messaging
- **Real-time Conversations**: Send and receive messages instantly
- **One-on-One Chat**: Direct messaging with other users
- **Message Management**: Reply to messages, delete your own messages
- **Unread Indicators**: See unread message counts at a glance
- **Message History**: Access previous conversations

### Accessibility
- **Screen Reader Support**: Full compatibility with TalkBack (Android) and VoiceOver (iOS)
- **Accessible Forms**: All input fields have proper labels and hints
- **Audio Announcements**: Get notified of new messages and calls
- **High Contrast Mode**: Optional high-contrast theme for better visibility
- **Adjustable Font Sizes**: Choose from small, normal, large, and extra-large text
- **Keyboard Navigation**: Full keyboard support for all features

### Voice Features
- **Voice Calling**: Real-time voice calls via WebRTC
- **Voice Notes**: Record and send voice messages
- **Voice Transcription**: Automatic transcription of voice notes
- **Audio Controls**: Mute, volume control, and speaker options

### User Management
- **User Registration**: Create a new account
- **User Login**: Secure authentication
- **Profile Management**: Update display name and status message
- **Member Directory**: Browse and search for other users
- **Online Status**: See who's online or offline

### Settings
- **Accessibility Preferences**: Customize screen reader verbosity
- **Audio Notifications**: Control notification sounds and volume
- **Typing Announcements**: Get notified when others are typing
- **Theme Settings**: Light and dark mode options

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Expo CLI: `npm install -g expo-cli`
- Android SDK (for Android development)
- Android Studio or Android emulator

### Steps

1. **Navigate to the project directory**:
   ```bash
   cd accessible-chat-mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API endpoint** (optional):
   - Edit `src/services/api.ts` and update `API_BASE_URL` if needed
   - Default: `https://blindchat-tgcrjvff.manus.space/api/trpc`

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Run on Android**:
   - Press `a` in the Expo CLI to open on Android emulator
   - Or use: `npm run android`

6. **Build APK for production**:
   ```bash
   eas build --platform android --profile production
   ```

## Project Structure

```
accessible-chat-mobile/
├── src/
│   ├── screens/          # Screen components
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── ConversationDetailScreen.tsx
│   │   ├── MembersScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/         # API and service layer
│   │   └── api.ts
│   ├── context/          # React context
│   │   └── AuthContext.tsx
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   └── utils/            # Utility functions
├── App.tsx               # Main app component with navigation
├── app.json              # Expo configuration
└── package.json          # Dependencies
```

## Key Components

### Authentication
- **LoginScreen**: User login with email and password
- **RegisterScreen**: New user registration
- **AuthContext**: Manages authentication state and user data

### Messaging
- **ChatScreen**: Conversation list with unread counts
- **ConversationDetailScreen**: Individual chat interface
- **Message sending, replying, and deletion**

### User Management
- **MembersScreen**: Browse and search users
- **ProfileScreen**: Edit user profile
- **SettingsScreen**: Accessibility and notification preferences

### API Integration
- **api.ts**: tRPC client for backend communication
- Handles authentication, messaging, file uploads, and calls

## Accessibility Features

### Screen Reader Support
- All buttons and interactive elements have proper `accessibilityLabel` and `accessibilityHint`
- ARIA-like announcements for state changes
- Live region announcements for new messages

### Keyboard Navigation
- Full keyboard support with Tab navigation
- Enter to activate buttons
- Escape to close dialogs

### Visual Accessibility
- High contrast mode toggle
- Adjustable font sizes (4 levels)
- Clear focus indicators
- Proper color contrast ratios

### Audio Cues
- Notification sounds for messages and calls
- Adjustable volume control
- Option to disable audio notifications

## Building the APK

### Option 1: Using EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Build APK
eas build --platform android --profile production
```

### Option 2: Local Build
```bash
# Install Expo CLI
npm install -g expo-cli

# Build locally
expo build:android
```

### Option 3: Using Android Studio
1. Export the project: `expo prebuild --clean`
2. Open in Android Studio: `open -a "Android Studio" android`
3. Build and run from Android Studio

## Configuration

### Environment Variables
Create a `.env` file in the project root:
```
API_BASE_URL=https://blindchat-tgcrjvff.manus.space/api/trpc
```

### Permissions
The app requires the following Android permissions:
- `RECORD_AUDIO`: For voice calls and voice notes
- `CAMERA`: For video calls (future feature)
- `READ_EXTERNAL_STORAGE`: For file attachments
- `WRITE_EXTERNAL_STORAGE`: For saving files
- `READ_CONTACTS`: For member directory
- `INTERNET`: For API communication

## Testing

### Manual Testing Checklist
- [ ] Login and registration flows
- [ ] Send and receive messages
- [ ] Delete messages
- [ ] View member directory
- [ ] Search for members
- [ ] Initiate voice calls
- [ ] Update profile
- [ ] Change accessibility settings
- [ ] Test with screen reader (TalkBack)
- [ ] Test keyboard navigation

### Screen Reader Testing
1. Enable TalkBack (Android):
   - Settings > Accessibility > TalkBack > Enable
2. Navigate using volume buttons and gestures
3. Verify all interactive elements are announced

## Troubleshooting

### Build Issues
- Clear cache: `npm start -- --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Update Expo: `npm install -g expo-cli@latest`

### Connection Issues
- Verify API endpoint in `src/services/api.ts`
- Check network connectivity
- Ensure backend server is running

### Permission Issues
- Check `app.json` permissions configuration
- Manually grant permissions in Android settings
- Rebuild the app after permission changes

## Contributing

To contribute improvements:
1. Create a feature branch
2. Make your changes
3. Test thoroughly with screen readers
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- Check the troubleshooting section
- Review the accessibility documentation
- Contact the development team

---

**Version**: 1.0.0  
**Last Updated**: May 2026  
**Built with**: React Native, Expo, TypeScript
