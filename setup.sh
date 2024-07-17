#!/bin/bash

# Check if .nodeversion file exists, if not create it with default version 20
if [ ! -f ".nodeversion" ]; then
    echo "20" > .nodeversion
    echo ".nodeversion file not found. Created with default Node.js version 20."
fi

# Read the Node.js version from .nodeversion file
NODE_VERSION=$(cat .nodeversion)

# Check if nvm is installed, and install it if not
if ! command -v nvm &> /dev/null
then
    echo "nvm could not be found. Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

    # Load nvm
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Install and use the correct Node version
nvm install "$NODE_VERSION"
nvm use "$NODE_VERSION"

# Install global dependencies
npm install -g expo-cli eas-cli

# Install project dependencies
if [ -f "package-lock.json" ]; then
    npm ci
else
    npm install
fi

# Fix Watchman recrawl warning
if command -v watchman &> /dev/null
then
    watchman watch-del "$(pwd)"
    watchman watch-project "$(pwd)"
fi

echo -e "\033[33m Note: Occasionally the ./setup.sh script will not properly set your global node version.\033[0m"
echo -e "\033[33m Run 'node -v' to ensure you are on the correct node version. If you are not, then run 'nvm use 20' before starting the development server.\033[0m"
echo ""
echo -e "\033[32m You can now run 'npx expo start' to start the development server.\033[0m"