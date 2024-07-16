# Welcome to DblFeature 👋

This is a React Native project created with [Expo](https://expo.dev) and [`create-expo-app`](https://www.npmjs.com/package/create-expo-app). This app uses The Movie Database (TMDb) API to fetch and display movie information.

DblFeature is a fun and engaging app designed for people to find the perfect movie match to watch together. With a Tinder-style interface, users can swipe through movie options to get personalized recommendations based on their preferences. The app also provides suggestions for movie snacks to enhance the viewing experience. Whether you're in the mood for a romantic comedy or an action-packed thriller, DblFeature helps couples discover the ideal movie for a cozy night in.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** and **src** directories.

## Project Structure

```
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

### Environment Variables

Make sure to set up your `.env` file with your TMDb access token:

```
TMDB_ACCESS_TOKEN=your_tmdb_access_token
```

## Learn more

To learn more about developing your project with Expo and React Native, check out the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
- [React Native documentation](https://reactnative.dev/docs/getting-started): Comprehensive guide to React Native.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
