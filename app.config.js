export default {
  "name": "RecycleMe",
  "slug": "RecycleMe",
  "version": "1.0.0",
  "orientation": "portrait",
  "scheme": "myapp",
  "userInterfaceStyle": "automatic",
  "privacy": "public",
  "icon": "./assets/images/ecopal.png",
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
      "googleMapsApiKey": 'AIzaSyD53F4b8-LEb3Q4w7jYE95E_3JnHhr8nyE'
    }
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/images/adaptive-icon.png",
      "backgroundColor": "#ffffff"
    },
    "config": {
      "googleMaps": {
        "apiKey": 'AIzaSyCyQqM_iRJnLifrXK0l3v5ynKjsNwGLGPg'
      }
    },
    "package": "com.aankur01.greendayfrontend"
  },
  "web": {
    "favicon": "./assets/images/favicon.png"
  },
  "description": "",
  "githubUrl": "https://github.com/Ankur-0429"
}
