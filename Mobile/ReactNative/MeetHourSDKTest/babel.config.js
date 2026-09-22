module.exports = {
  // React Native replaced metro-react-native-babel-preset with @react-native/babel-preset
  // in 0.73; the old package no longer ships and Metro fails to resolve it.
  presets: ['module:@react-native/babel-preset'],
};
