import React from 'react';
import { View, Text } from 'react-native';
import {auth} from '../api/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

const AuthScreen = () => {
  var email = "yester1324@gmail.com";
  var password = "abcd1234";


  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      console.log("User is logged in");
      // ...
    } else {
      // User is signed out
      // ...
      console.log("User isn't logged in");
    }
  });
  
  signOut(auth);
  var user;
  if (auth.currentUser != null)
    user = auth.currentUser.email;
  else
    user = "User not logged in";
  
  
  return (
    <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
      <Text style={{color:"#FFFFFF"}}>
        {user}
      </Text>
    </View>
  )
}

export default AuthScreen
