const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Update the transformer and resolver settings to handle SVGs
config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
config.resolver.sourceExts.push("svg");

module.exports = config;
