// React Native entry point: registers the bundled native random source
// (iOS SecRandomCopyBytes, Android SecureRandom) before exporting the API.
import './nativeRandom.js';

export * from './index.js';
export {default} from './index.js';
