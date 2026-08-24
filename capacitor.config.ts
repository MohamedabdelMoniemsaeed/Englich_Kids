import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.englishkids.app',
  appName: 'English Kids',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
