const fs = require("fs");
const path = require("path");

// Path to app.json file
const appJsonPath = path.join(process.cwd(), "app.json");

// Read the app.json file
const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));

// Check if the ios buildNumber exists
if (appJson.expo.ios && appJson.expo.ios.buildNumber) {
  // Increment the versionCode
  appJson.expo.ios.buildNumber = (
    parseInt(appJson.expo.ios.buildNumber, 10) + 1
  ).toString();
  console.log(`New versionCode: ${appJson.expo.ios.buildNumber}`);
} else {
  console.error("ios.buildNumber not found in app.json");
  process.exit(1);
}

// Write the updated app.json back to the file
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2), "utf8");
console.log("Updated app.json successfully!");
