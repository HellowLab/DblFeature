# DblFeature 🎥

Welcome to DblFeature, your ultimate movie companion crafted with the latest React Native technology and [Expo](https://expo.dev). DblFeature taps into The Movie Database (TMDb) API to offer a seamless, engaging experience for movie lovers everywhere.

With our initial release, you can swipe through a diverse selection of films, rate your favorites, connect with friends, and match for the perfect movie night. But that’s just the start. Stay tuned as we roll out exciting new features like personalized recommendations and social integrations to make your movie-watching experience even more enjoyable and connected. Dive into a world of cinema like never before with DblFeature.

## Table of Contents

- [Project Overview](#project-overview)
  - [Key Features](#key-features)
  - [Target Audience](#target-audience)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Usage Guide](#usage-guide)
  - [Running the Application](#running-the-application)
  - [Common Commands](#common-commands)
- [Contribution Guidelines](#contribution-guidelines)
  - [Branch Management](#branch-management)
  - [Coding Standards](#coding-standards)
  - [Pull Request Procedure](#pull-request-procedure)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
  - [Local Backend Setup](#local-backend-setup)
  - [API Base URL for iOS](#api-base-url-for-ios)
- [Additional Resources](#additional-resources)

---

## Project Overview

**DblFeature** is a mobile application aimed at enhancing the movie-watching experience. Users can swipe through a curated selection of movies, rate their favorites, and connect with friends to find the perfect movie to watch together. The app’s initial release focuses on delivering the core features, with a roadmap to add sophisticated functionalities like recommendation algorithms and more robust social features in future updates.

### Key Features

- **Swipe Movies:** Users can swipe left or right on movie cards, indicating whether they like or dislike a movie.
- **Rate Movies:** Rate your favorite movies using a star rating system.
- **Add Friends:** Connect with friends within the app to see their movie preferences.
- **Match with Friends:** Find movies that both you and your friends have liked, making movie night decisions easier.

### Target Audience

DblFeature is designed for anyone who enjoys movies and is looking for an easy way to discover new films, either alone or with friends. Whether you're a casual viewer or a film aficionado, DblFeature has something to offer.

---

## Setup Instructions

Setting up the DblFeature development environment is straightforward, thanks to React Native Expo’s powerful tools. Below are the detailed instructions to get you up and running.

### Prerequisites

Before you begin, ensure you have the following software installed:

1. **Node Version Manager (nvm):**

   - Install nvm by following the instructions on the [nvm GitHub repository](https://github.com/nvm-sh/nvm). Nvm allows you to manage multiple versions of Node.js on your machine.

2. **Node.js (v20 or later):**

   - Use nvm to install Node.js version 20. You can do this with the following commands:
     ```bash
     nvm install 20
     nvm use 20
     ```

3. **Expo CLI:**

   - Install the Expo CLI globally using npm:
     ```bash
     npm install -g expo-cli
     ```

4. **EAS CLI (Expo Application Services):**

   - Install the EAS CLI globally using npm:
     ```bash
     npm install -g eas-cli
     ```

5. **Android Studio:**

   - Android Studio is required for Android development. Download and install it from [here](https://developer.android.com/studio). Ensure that the Android SDK is correctly configured.

6. **Xcode:**
   - Xcode is required for iOS development and is only available on macOS. Download and install it from the [Mac App Store](https://apps.apple.com/us/app/xcode/id497799835?mt=12). Ensure you have set up Xcode with the necessary iOS SDKs.

### Installation

Follow these steps to clone the repository and install all necessary dependencies:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/hellowlab/DblFeature.git
   cd DblFeature
   ```

2. **Install Node.js Using nvm:**

   - Ensure you are using the correct Node.js version:
     ```bash
     nvm install 20
     nvm use 20
     ```

3. **Install Global Dependencies:**

   - Install Expo CLI and EAS CLI globally if you haven't done so already:
     ```bash
     npm install -g expo-cli eas-cli
     ```

4. **Install Project Dependencies:**
   - Install all the project’s dependencies:
     ```bash
     npm install
     ```

5.**Optional Setup Script:** - The repository includes a setup script that automates the installation process:
`bash
     chmod +x setup.sh
     ./setup.sh
     `
**Note:** The setup script is not frequently updated, so manual verification is recommended. If the global Node.js version isn’t set correctly, you can manually switch to Node 20 by running `nvm use 20`.

### Running the App

To start developing, you must first generate a build on your device. Follow these steps based on your development environment:

1.**Generate a Build on iOS:** - Use this command to build and run the app on an iOS simulator or device:
`bash
     npx expo run:ios`

2.**Generate a Build on Android:** - Use this command to build and run the app on an Android emulator or device:
`bash
     npx expo run:android`

3.**Start the Development Server:** - Once the initial build is complete, start the Expo development server:
`bash
     npx expo start
     `

You will have the option to open the app in a development build, an Android emulator, an iOS simulator, or Expo Go. The development server will hot-reload changes as you make them, allowing for rapid iteration.

## Usage Guide

The following guide provides detailed instructions on how to use, test, and deploy the DblFeature application.

### Running the Application

1. **Development Build:** - After running the `npx expo run:ios` or `npx expo run:android` command, you can use `npx expo start` to run the application in development mode.

2. **Testing:** - Currently, there are no automated tests integrated into the project. Manual testing should be conducted to ensure that new features work as expected.

3. **Deployment:** - Deployment procedures will be introduced as the project evolves. For now, ensure that builds are thoroughly tested before being pushed to production environments.

### Common Commands

- **Starting the Development Server (Development Builds for iOS/Android):**

  ```bash
  npx expo start
  ```

  When prompted, type 'a' to run on an android simulator or 'i' to run on an iOS simulator.

- **Building a Production Build for Android Deployment:**

  ```bash
  eas build --platform android
  ```

- **Building a Production Build for iOS Deployment:**
  ```bash
  eas build --platform ios
  ```

---

## Contribution Guidelines

Contributing to DblFeature is welcome and encouraged! Please adhere to the following guidelines to maintain code quality and streamline collaboration.

### Branch Management

1. **Issue Branches:**

   - When working on an issue, create a new branch from `integration` named after the GitHub issue ticket, following this pattern:
     ```plaintext
     30-add-new-feature
     ```
     Where 30 is the ticket number, and Add New Feature is the name of the ticket.

2. **Pull Requests to Integration:**

   - Once your work on a feature or bug fix is complete, submit a pull request (PR) to the `integration` branch. Ensure your branch is up-to-date with `integration` before submitting the PR.

3. **Pull Requests to Master:**
   - After completing and testing all tickets for a sprint, a PR from `integration` to `master` is created. This PR must be reviewed and approved by a Code Owner. Our branch protection rules ensure that no changes can be merged into `master` without approval.

### Coding Standards

1. **Code Quality:**

   - Follow best practices in your code, including clear naming conventions, DRY (Don't Repeat Yourself) principles, and modular design.

2. **Prettier Formatting:**

   - The project uses Prettier for code formatting with the default TypeScript settings. If you are using VS Code, ensure that you have the Prettier extension installed:
     - **Installing Prettier in VS Code:**
       1. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
       2. Search for "Prettier - Code formatter" and install it.
     - **Setting Prettier as the Default Formatter:**
       1. Open the Command Palette with `Ctrl+Shift+P` and search for "Format Document With..."
       2. Select "Configure Default Formatter..." and choose "Prettier - Code formatter."

### Pull Request Procedure

1. **Descriptive PRs:**

   - When creating a PR, include a clear and concise description of the changes made. Link the relevant GitHub issue in the description.

2. **Review Process:**

   - Every PR should be reviewed by at least one other developer. For PRs to `master`, approval from a Code Owner is required, as enforced by our branch protection rules.

3. **Testing:**

   - Thoroughly test your changes before submitting a PR. This includes manual testing on both Android and iOS platforms, ensuring cross-device compatibility.

4. **Merging:**
   - Only merge a PR once it has been approved and all required status checks have passed. Use the "Squash and merge" option to keep the commit history clean.

---

## Project Structure

The following is an overview of the key directories and files in the DblFeature project:

- **app/**:  
  Contains the main application components and screens.

  - `_layout.tsx`: The main layout component.
  - `index.tsx`: Entry point for the main screen.

- **assets/**:  
  Houses static assets such as images, fonts, and JSON data.

  - `data/`: Preloaded data files.
  - `fonts/`: Custom font files.
  - `images/`: Image files used across the app.

- **components/**:  
  Reusable React components used across different screens.

- **hooks/**:  
  Custom hooks to encapsulate logic that can be reused across components.

- **screens/**:  
  Contains the different screens that make up the app’s UI.

- **utils/**:  
  Utility functions and constants used across the application.

  - `APIs/`: API configuration and calls.
  - `callbacks/`: Callback functions used throughout the app.
  - `constants/`: Constant values used across the app.

- **.env**:  
  Environment variables required to run the project.

- **.gitignore**:  
  Specifies files and directories to be ignored by Git.

- **app.json**:  
  Configuration file for the Expo app.

- **babel.config.js**:  
  Babel configuration file for transpiling JavaScript.

- **expo-env.d.ts**:  
  TypeScript declaration file for Expo environment variables.

- **package-lock.json** & **package.json**:  
  NPM configuration files that list the project’s dependencies.

- **README.md**:  
  This README file.

- **tsconfig.json**:  
  TypeScript configuration file.

---

## Environment Variables

To properly run the project, you need to configure a `.env` file in the root of the repository with the following environment variables:

```plaintext
EXPO_PUBLIC_TMDB_ACCESS_TOKEN=your_tmdb_access_token
EXPO_PUBLIC_API_BASE_URL="http://10.0.2.2:8000/"  # For Android
```

### Local Backend Setup

During development, the app relies on a backend service that you need to set up locally. To do this:

1. **Clone the Backend Repository:**

   ```bash
   git clone https://github.com/HellowLab/HellowLabBackend_Django.git
   ```

2. **Follow the Instructions:**
   - Navigate to the backend repository and follow the instructions in its README to get the backend up and running.

### API Base URL for iOS

- If you are testing the app on iOS and running the backend locally, update your `.env` file with the following:
  ```plaintext
  EXPO_PUBLIC_API_BASE_URL="http://localhost:8000/"
  ```

**Note:** Once the backend is hosted and no longer running locally, the `EXPO_PUBLIC_API_BASE_URL` will be updated accordingly, and running the backend locally will no longer be necessary.

---

## Additional Resources

If you need further assistance or have any questions, please feel free to reach out to our support team at [support@hellowlab.com](mailto:support@hellowlab.com). We are here to help you succeed in your development journey with DblFeature.

---

_This README was meticulously crafted by [Sean Kudrna](https://github.com/SeanKudrna). Your contributions and suggestions are highly valued, and we encourage you to get involved in making DblFeature even better._

---
