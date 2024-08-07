# Welcome to DblFeature 👋

This is a React Native project created with [Expo](https://expo.dev) and [`create-expo-app`](https://www.npmjs.com/package/create-expo-app). This app uses The Movie Database (TMDb) API to fetch and display movie information.

DblFeature is a fun and engaging app designed for people to find the perfect movie match to watch together. With a Tinder-style interface, users can swipe through movie options to get personalized recommendations based on their preferences. The app also provides suggestions for movie snacks to enhance the viewing experience. Whether you're in the mood for a romantic comedy or an action-packed thriller, DblFeature helps couples discover the ideal movie for a cozy night in.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
  - [Building for Android](#building-for-android)
  - [Building for iOS](#building-for-ios)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Learn More](#learn-more)
- [Join the Community](#join-the-community)

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm)
- Node.js (v20 or later)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [EAS CLI](https://docs.expo.dev/eas/cli/)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development)

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/hellowlab/DblFeature.git
cd DblFeature
nvm install 20
nvm use 20
npm install -g expo-cli eas-cli
npm install
```

Alternatively, you can run the provided setup script to automate the above steps:

```bash
chmod +x setup.sh
./setup.sh
```

This script will:

- Install nvm if not already installed.
- Use the Node.js version specified in the .nodeversion file.
  - If no .nodeversion file exists, one is made and default version is set to 20.
- Install global dependencies (expo-cli, eas-cli).
- Install project dependencies.
- Update specific dependencies to the latest versions.
- Fix Watchman recrawl warnings.

#### NOTE:

- Occasionally the ./setup.sh script will not properly set your global node version. Run `node -v` after running ./setup.sh to ensure you are on the correct node version. If you are not, then run `nvm use 20` before starting the development server.

### Running the App

Start the Expo development server:

```bash
npx expo start
```

In the output, you'll find options to open the app in a:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** and **src** directories.

### Building for Android

To build the app for Android:

1. Ensure you have Android Studio installed and configured.
2. Run the following command to create an Android build:

```bash
eas build --platform android
```

### Building for iOS

To build the app for iOS:

1. Ensure you have Xcode installed and configured.
2. Run the following command to create an iOS build:

```bash
eas build --platform ios
```

Note: Building for iOS requires a macOS environment.

## Project Structure

```plaintext
├── app
│   ├── _layout.tsx
│   ├── index.styles.ts
│   └── index.tsx
├── assets
│   ├── data
│   ├── fonts
│   └── images
├── components
│   ├── AnimatedStack
│   ├── LoadingIndicator
│   └── MovieCard
├── hooks
├── screens
└── utils
    ├── APIs
    ├── callbacks
    └── constants
├── .env
├── .gitignore
├── app.json
├── babel.config.js
├── expo-env.d.ts
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

## Environment Variables

Make sure to set up your `.env` file with your TMDb access token:

```plaintext
TMDB_ACCESS_TOKEN=your_tmdb_access_token
```

## Learn More

To learn more about developing your project with Expo and React Native, check out the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
- [React Native documentation](https://reactnative.dev/docs/getting-started): Comprehensive guide to React Native.

## Join the Community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

---

_This README was generated by [Sean Kudrna](https://github.com/SeanKudrna). Feel free to reach out with any questions or contributions._
