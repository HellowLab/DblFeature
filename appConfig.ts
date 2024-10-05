// appConfig.js

// Import the version from package.json
const appConfig = {
  version: require("./package.json").version, // Retrieve and set the application version
};

// Export the appConfig object as the default export
export default appConfig;
