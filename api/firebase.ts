// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  getFirestore,
  orderBy,
  collection,
  query,
  GeoPoint,
  addDoc,
  startAt,
  endAt,
  getDocs,
} from "firebase/firestore";
import * as geofire from "geofire-common";

import getEnvVars from '../environment';
const { APIKEY, AUTHDOMAIN, PROJECTID, STORAGEBUCKET, MESSAGINGSENDERID, APPID, MEASUREMENTID } = getEnvVars();

const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: AUTHDOMAIN,
  projectId: PROJECTID,
  storageBucket: STORAGEBUCKET,
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID,
  measurementId: MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
const db = getFirestore(app);
const geoData = collection(db, "geoLocation");
const provider = new GoogleAuthProvider();

export const write_data_hash = async (
  latitude: number,
  longitude: number,
  title: string,
  message: string,
  icon: string,
  name: string
) => {
  // Compute the GeoHash for a lat/lng point
  const hash = geofire.geohashForLocation([latitude, longitude]);

  addDoc(geoData, {
    title: title,
    description: message,
    icon: icon,
    name: name,
    coordinates: new GeoPoint(latitude, longitude),
    hash: hash
  });
};

export const read_data_hash = async(
  latitude: number,
  longitude: number,
  setUserData: any
) => {

  // Find cities within 50km of London
  const center = [latitude, longitude];
  const radiusInM = 10 * 1000;
  let ans:any = []
  
  // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
  // a separate query for each pair. There can be up to 9 pairs of bounds
  // depending on overlap, but in most cases there are 4.
  const bounds = await geofire.geohashQueryBounds(center, radiusInM);
  const promises = [];
  for (const b of bounds) {
    const q = query(geoData, orderBy('hash'), startAt(b[0]), endAt(b[1]))
    const querySnapshot = await getDocs(q)
    promises.push(querySnapshot);
  }
    
  // Collect all the query results together into a single list

 // Collect all the query results together into a single list
  Promise.all(promises).then((snapshots) => {
    const matchingDocs = [];

    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const lat = doc.get('coordinates').latitude as number;
        const lng = doc.get('coordinates').longitude as number;

        // We have to filter out a few false positives due to GeoHash
        // accuracy, but most will match
        const distanceInKm = geofire.distanceBetween([lat, lng], center);
        const distanceInM = distanceInKm * 1000;
        if (distanceInM <= radiusInM) {
          matchingDocs.push(doc.data());
        }
      }
    }
      setUserData(matchingDocs)
    })
}

export function login(email:string, password:string) {
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      return user;
      // ...
  })
  .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return error.code;
  });
}

export function signin(email:string, password:string, passwordC:string) {
  if (password !== passwordC)
  {
    return "Password isn't the same";
  }
  
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    return user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    return errorCode;
    // ..
  });
}

export function checkAuth(user:JSON) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      return "User is logged in"
      // ...
    } else {
      // User is signed out
      // ...
      return "Use is not logged in"
    }
  });
}

export function googleLogin() {
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    // @ts-ignore
    const token = credential.accessToken;

    // The signed-in user info.
    const user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
}