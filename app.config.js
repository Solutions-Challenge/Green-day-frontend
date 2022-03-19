export default {
  "name": "RecycleMe",
  "slug": "RecycleMe",
  "version": "0.0.11",
  "orientation": "portrait",
  "scheme": "myapp",
  "userInterfaceStyle": "automatic",
  "privacy": "public",
  "icon": "./assets/images/ecopal.png",
  "splash": {
    "image": "./assets/images/ecopal.png",
    "resizeMode": "contain",
    "backgroundColor": "#ffffff"
  },
  "platforms": ["ios", "android", "web"],
  "assetBundlePatterns": ["**/*"],
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
    "versionCode": 11,
    "adaptiveIcon": {
      "foregroundImage": "./assets/images/ecopal.png",
      "backgroundColor": "#ffffff"
    },
    "config": {
      "googleSignIn": {
        "apiKey": "AIzaSyBbm-NJdj5KOF7vSkppra3JYivdDEWPsv8",
        "certificateHash": "09:E1:53:06:ED:33:CC:3B:56:28:DC:20:99:DC:83:B6:6D:DD:F4:E1"
      },
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
