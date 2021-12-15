export default {
  "name": "greenday-frontend",
  "slug": "greenday-frontend",
  "version": "1.0.0",
  "orientation": "portrait",
  "scheme": "myapp",
  "userInterfaceStyle": "automatic",
  "privacy": "public",
  "icon": "./assets/images/ecopal.png",
  "expo": {
    "android": {
      "googleServicesFile": "./assets/firebase/google-services.json"
    },
    "ios": {
      "googleServicesFile": "./assets/firebase/GoogleService-Info.plist"
    },
    "plugins": [
      "@react-native-firebase/app",
    ]
  },
  "splash": {
    "image": "./assets/images/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#ffffff"
  },
  "updates": {
    "fallbackToCacheTimeout": 0
  },
  "assetBundlePatterns": [
    "**/*"
  ],
  "ios": {
    "supportsTablet": true,
    "config": {
      "googleMapsApiKey": process.env.IosMapsApiKey
    }
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/images/adaptive-icon.png",
      "backgroundColor": "#ffffff"
    },
    "config": {
      "googleMaps": {
        "apiKey": process.env.AndroidMapsApiKey
      }
    },
    "package": "com.aankur01.greendayfrontend"
  },
  "web": {
    "favicon": "./assets/images/favicon.png"
  },
  "description": "",
  "githubUrl": "https://github.com/Ankur-0429/Green-day-frontend"
}
