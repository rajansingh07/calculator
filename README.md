# Calculator App

A modern, feature-rich calculator application built with React Native and Expo. This app provides a seamless mathematical experience with a focus on usability, design, and performance.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📱 Features

### Core Functionality
- **Standard Arithmetic**: Perform addition, subtraction, multiplication, and division with ease.
- **Advanced Operations**: Includes support for percentages (`%`) and negation (`+/-`).
- **Smart Formatting**: Input numbers are automatically formatted for readability.
- **Input Validation**: Prevents invalid inputs and handles errors gracefully.

### User Experience
- **Calculation History**: View your past calculations in a draggable bottom sheet modal. History is persisted locally so you never lose track of your work.
- **Theme Support**: Fully supports System Light and Dark modes with an adaptive color palette.
- **Haptic Feedback**: Meaningful tactile feedback on button presses for a responsive feel.
- **Gesture Controls**: Interactive UI elements including a gesture-driven history viewer.

### Technical Highlights
- **State Management**: Robust logic handling using React Hooks and Reducers.
- **Persistence**: Uses `AsyncStorage` to save calculation history across sessions.
- **Type Safety**: Built completely with TypeScript for reliability.
- **Tests**: Comprehensive unit tests for calculator logic and formatting utilities.

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- npm or yarn
- Expo Go app on your physical device (Android/iOS) OR an Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npx expo start
   ```

4. **Run on Device/Emulator**
   - Scan the QR code with the **Expo Go** app (Android) or Camera (iOS).
   - Press `a` to run on Android Emulator.
   - Press `i` to run on iOS Simulator.
   - Press `w` to run on Web.

## 🧪 Testing

The project includes a suite of tests to ensure calculation accuracy.

```bash
npm test
```

## 🛠 Tech Stack

- **Framework**: [Expo](https://expo.dev) & [React Native](https://reactnative.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction)
- **Storage**: @react-native-async-storage/async-storage
- **Icons**: @expo/vector-icons
- **Testing**: Jest & React Native Testing Library

## 📂 Project Structure

```
Calculator/
├── app/                  # Expo Router pages
├── src/
│   ├── components/       # Reusable UI components (Button, Display, History)
│   ├── constants/        # App constants (Colors, Layout, Buttons)
│   ├── hooks/            # Custom hooks (useCalculator, etc.)
│   ├── types/            # TypeScript definitions
│   └── utils/            # Helper functions (Math logic, Formatting)
├── __tests__/            # Unit tests
└── ...config files
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
