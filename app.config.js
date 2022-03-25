export default {
  name: "RecycleMe",
  slug: "RecycleMe",
  version: "0.0.20",
  orientation: "portrait",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  privacy: "public",
  icon: "./assets/images/ecopalOriginal.png",
  splash: {
    image: "./assets/images/ecopalOriginal.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  platforms: ["ios", "android", "web"],
  assetBundlePatterns: ["**/*"],
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    icon: "./assets/images/ecopalOriginal.png",
    supportsTablet: true,
    bundleIdentifier: "com.aankur01.greendayfrontend",
    usesAppleSignIn: true,
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
      NSCameraUsageDescription:
        "This app uses the camera to determine if a certain item is recyclable.",
      NSLocationWhenInUseUsageDescription:
        "This app uses location data to find the nearest recycling centers from your current location."
    },
    config: {
      googleSignIn: {
        reservedClientId: "com.googleusercontent.apps.15765189134-95danbaij05prgd321aoscb6igfpj8jt"
      },
      googleMapsApiKey: "AIzaSyD53F4b8-LEb3Q4w7jYE95E_3JnHhr8nyE",
    },
    associatedDomains: [],
  },
  android: {
    versionCode: 20,
    adaptiveIcon: {
      foregroundImage: "./assets/images/ecopal.png",
      backgroundColor: "#ffffff",
    },
    config: {
      googleSignIn: {
        apiKey: "AIzaSyBbm-NJdj5KOF7vSkppra3JYivdDEWPsv8",
        certificateHash:
          "09:E1:53:06:ED:33:CC:3B:56:28:DC:20:99:DC:83:B6:6D:DD:F4:E1",
      },
      googleMaps: {
        apiKey: "AIzaSyCyQqM_iRJnLifrXK0l3v5ynKjsNwGLGPg",
      },
    },
    package: "com.aankur01.greendayfrontend",
  },
  web: {
    favicon: "./assets/images/favicon.png",
  },
  description: "",
  githubUrl: "https://github.com/Ankur-0429",
};
