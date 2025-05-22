const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Personalizações
config.resolver.sourceExts.push('mjs');
config.transformer.unstable_allowRequireContext = true;

module.exports = config;