// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, orderBy, collection, query, GeoPoint, addDoc, where, getDocs, limit } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyAz1kUNeaduc9_wh6_md3QduHKPMix25w4",
  authDomain: "greenday-6aba2.firebaseapp.com",
  projectId: "greenday-6aba2",
  storageBucket: "greenday-6aba2.appspot.com",
  messagingSenderId: "15765189134",
  appId: "1:15765189134:web:e9e4664b4d11b0eea4425f",
  measurementId: "G-K8WTS2FZ7T"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const geoData = collection(db, 'geoLocation')


export const read_data = async(latitude:number, longitude:number, setUserData:any) => {
  const querySnapshot = await getDocs(geoData)
  
  let ans:any = []
  await querySnapshot.forEach((e)=>{
    if (e.exists() && typeof(e.data().coordinates) != "undefined") {
      ans.push(e.data())
    }
  })
  setUserData(ans)
} 

export const write_data = async(latitude:number, longitude:number, name:string, message:string) => {
  addDoc(geoData, {
    title: name,
    description: message,
    coordinates: new GeoPoint(latitude, longitude)
  })
}