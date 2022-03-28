import Constants from "expo-constants";

const ENV = {
  dev: {
    IOSMAPSAPIKEY: "AIzaSyD53F4b8-LEb3Q4w7jYE95E_3JnHhr8nyE",
    ANDROIDMAPSAPIKEY: "AIzaSyCyQqM_iRJnLifrXK0l3v5ynKjsNwGLGPg",
    GOOGLEMAPSPLACESEARCHAPIKEY: "AIzaSyBMbWY4MdhLL_4_INb1G1A4gOljIug_xag",
    CLOUDVISIONAPIKEY: "AIzaSyCxu7V_gQEgSGzu_uv76vuMcxF0lbbgZ34",

    APIKEY: "AIzaSyAz1kUNeaduc9_wh6_md3QduHKPMix25w4",
    AUTHDOMAIN: "greenday-6aba2.firebaseapp.com",
    PROJECTID: "greenday-6aba2",
    STORAGEBUCKET: "greenday-6aba2.appspot.com",
    MESSAGINGSENDERID: "15765189134",
    APPID: "1:15765189134:web:a3618bb97c578df7a4425f",
    MEASUREMENTID: "G-V770MH3MEF",

    OATHCLIENTID: "816316595942-fgk73ia95mi7obj9n0t5stm033d5g2um.apps.googleusercontent.com",
    CLIENTSECRET: "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",
    STATISMAPSAPIKEY : "AIzaSyA-FTTHUwKyHJNm8I4ejT-lZUFSCTENJQY"
  },

  staging: {
    IOSMAPSAPIKEY: "AIzaSyD53F4b8-LEb3Q4w7jYE95E_3JnHhr8nyE",
    ANDROIDMAPSAPIKEY: "AIzaSyCyQqM_iRJnLifrXK0l3v5ynKjsNwGLGPg",
    GOOGLEMAPSPLACESEARCHAPIKEY: "AIzaSyBMbWY4MdhLL_4_INb1G1A4gOljIug_xag",
    CLOUDVISIONAPIKEY: "AIzaSyCxu7V_gQEgSGzu_uv76vuMcxF0lbbgZ34",

    APIKEY: "AIzaSyAz1kUNeaduc9_wh6_md3QduHKPMix25w4",
    AUTHDOMAIN: "greenday-6aba2.firebaseapp.com",
    PROJECTID: "greenday-6aba2",
    STORAGEBUCKET: "greenday-6aba2.appspot.com",
    MESSAGINGSENDERID: "15765189134",
    APPID: "1:15765189134:web:a3618bb97c578df7a4425f",
    MEASUREMENTID: "G-V770MH3MEF",

    OATHCLIENTID: "816316595942-fgk73ia95mi7obj9n0t5stm033d5g2um.apps.googleusercontent.com",
    CLIENTSECRET: "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",
    STATISMAPSAPIKEY : "AIzaSyA-FTTHUwKyHJNm8I4ejT-lZUFSCTENJQY"
  },

  production: {
    IOSMAPSAPIKEY: "AIzaSyD53F4b8-LEb3Q4w7jYE95E_3JnHhr8nyE",
    ANDROIDMAPSAPIKEY: "AIzaSyCyQqM_iRJnLifrXK0l3v5ynKjsNwGLGPg",
    GOOGLEMAPSPLACESEARCHAPIKEY: "AIzaSyBMbWY4MdhLL_4_INb1G1A4gOljIug_xag",
    CLOUDVISIONAPIKEY: "AIzaSyCxu7V_gQEgSGzu_uv76vuMcxF0lbbgZ34",

    APIKEY: "AIzaSyAz1kUNeaduc9_wh6_md3QduHKPMix25w4",
    AUTHDOMAIN: "greenday-6aba2.firebaseapp.com",
    PROJECTID: "greenday-6aba2",
    STORAGEBUCKET: "greenday-6aba2.appspot.com",
    MESSAGINGSENDERID: "15765189134",
    APPID: "1:15765189134:web:a3618bb97c578df7a4425f",
    MEASUREMENTID: "G-V770MH3MEF",

    OATHCLIENTID: "816316595942-fgk73ia95mi7obj9n0t5stm033d5g2um.apps.googleusercontent.com",
    CLIENTSECRET: "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",
    STATISMAPSAPIKEY : "AIzaSyA-FTTHUwKyHJNm8I4ejT-lZUFSCTENJQY"
  },

  default: {
    IOSMAPSAPIKEY: "AIzaSyD53F4b8-LEb3Q4w7jYE95E_3JnHhr8nyE",
    ANDROIDMAPSAPIKEY: "AIzaSyCyQqM_iRJnLifrXK0l3v5ynKjsNwGLGPg",
    GOOGLEMAPSPLACESEARCHAPIKEY: "AIzaSyBMbWY4MdhLL_4_INb1G1A4gOljIug_xag",
    CLOUDVISIONAPIKEY: "AIzaSyCxu7V_gQEgSGzu_uv76vuMcxF0lbbgZ34",

    APIKEY: "AIzaSyAz1kUNeaduc9_wh6_md3QduHKPMix25w4",
    AUTHDOMAIN: "greenday-6aba2.firebaseapp.com",
    PROJECTID: "greenday-6aba2",
    STORAGEBUCKET: "greenday-6aba2.appspot.com",
    MESSAGINGSENDERID: "15765189134",
    APPID: "1:15765189134:web:a3618bb97c578df7a4425f",
    MEASUREMENTID: "G-V770MH3MEF",

    OATHCLIENTID: "816316595942-fgk73ia95mi7obj9n0t5stm033d5g2um.apps.googleusercontent.com",
    CLIENTSECRET: "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",
    STATISMAPSAPIKEY : "AIzaSyA-FTTHUwKyHJNm8I4ejT-lZUFSCTENJQY"
  },
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  if (__DEV__) {
    return ENV.dev;
  } else if (env === "staging") {
    return ENV.staging;
  } else if (env === "prod") {
    return ENV.prod;
  } else if (env === "default") {
    return ENV.default;
  }
};

export default getEnvVars;