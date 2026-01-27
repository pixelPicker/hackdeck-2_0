const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add 'db' for your SQLite database and 'tflite' for your AI model
config.resolver.assetExts.push('db', 'tflite');

module.exports = config;