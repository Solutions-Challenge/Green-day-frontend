// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
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

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
  measurementId: process.env.MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const geoData = collection(db, "geoLocation");

export const read_data = async (
  latitude: number,
  longitude: number,
  setUserData: any
) => {
  const querySnapshot = await getDocs(geoData);

  let ans: any = [];
  await querySnapshot.forEach((e) => {
    if (e.exists() && typeof e.data().coordinates != "undefined") {
      ans.push(e.data());
    }
  });
  setUserData(ans);
};

export const write_data = async (
  latitude: number,
  longitude: number,
  name: string,
  message: string,
  imageIndex: number
) => {
  addDoc(geoData, {
    title: name,
    description: message,
    imageIndex: imageIndex,
    coordinates: new GeoPoint(latitude, longitude),
  });
};

export const write_data_hash = async (
  latitude: number,
  longitude: number,
  name: string,
  message: string,
  imageIndex: number
) => {
  // Compute the GeoHash for a lat/lng point
  const hash = geofire.geohashForLocation([latitude, longitude]);

  addDoc(geoData, {
    title: name,
    description: message,
    imageIndex: imageIndex,
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

