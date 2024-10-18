const fs = require('fs');
const path = require('path');

// Path to app.json file
const appJsonPath = path.join(process.cwd(), 'app.json');

// Read the app.json file
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

// Check if the android versionCode exists
if (appJson.expo.android && appJson.expo.android.versionCode) {
  // Increment the versionCode
  appJson.expo.android.versionCode += 1;
  console.log(`New versionCode: ${appJson.expo.android.versionCode}`);
} else {
  console.error('android.versionCode not found in app.json');
  process.exit(1);
}

// Write the updated app.json back to the file
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2), 'utf8');
console.log('Updated app.json successfully!');
