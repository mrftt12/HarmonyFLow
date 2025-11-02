const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Exclude API files from Metro bundler (these are for server-side deployment)
config.resolver.blockList = [
  /api\/.*/,  // Exclude api directory
];

module.exports = withNativeWind(config, { input: './global.css' });
