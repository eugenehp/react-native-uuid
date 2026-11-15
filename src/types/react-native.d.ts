// Minimal typing for the one React Native API this package uses, so the
// package builds without react-native installed.
declare module 'react-native' {
  export const NativeModules: {[name: string]: unknown} | undefined;
}
