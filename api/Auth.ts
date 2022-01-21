import * as Google from "expo-google-app-auth";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
export const auth = getAuth();

const provider = new GoogleAuthProvider();

export const handleGoogleSignIn = async () => {
  const config = {
    androidClientId:
      "816316595942-qdl7p7g6cqgf6mem4c33q52u64tmmk73.apps.googleusercontent.com",
    iosClientId:
      "816316595942-1t8utcje5adcq2meiur0peup5o99qp15.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  };

  await Google.logInAsync(config)
    .then((res) => {
      // @ts-ignore
      const { type, user } = res;
      if (type === "success") {
        console.log("success");
        const { email, name, photoUrl } = user;
        console.log(email, name, photoUrl);
      } else {
        console.log("canceled");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export function login(email: string, password: string) {
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

export function signin(email: string, password: string, passwordC: string) {
  if (password !== passwordC) {
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

export function checkAuth(user: JSON) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      return "User is logged in";
      // ...
    } else {
      // User is signed out
      // ...
      return "Use is not logged in";
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
    })
    .catch((error) => {
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
