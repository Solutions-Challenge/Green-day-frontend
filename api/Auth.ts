import * as Google from "expo-google-app-auth";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  deleteUser,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  updateProfile,
  User,
  signInWithCredential,
} from "firebase/auth";
export const auth = getAuth();

const provider = new GoogleAuthProvider();

export const handleGoogleSignIn = async (setUri: any) => {
  let user = {} as any;
  let error = {} as any;

  const config = {
    androidClientId:
      "15765189134-2uvjibunbcdje9ehscg1fcqi0k3j0v43.apps.googleusercontent.com",
    iosClientId:
      "15765189134-u5vlkk5ncmkl0lceg3pkd5t85rur7026.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  };

  await Google.logInAsync(config)
    .then((res) => {
      if (res.type === 'success') {
        const { idToken, accessToken } = res;
        const credential = GoogleAuthProvider.credential(
            idToken,
            accessToken
        );
        signInWithCredential(auth, credential);
        user = res.user
      }
      else if (res.type === "cancel") {
        user = user.type
      }
    })
    .catch((err) => {
      error = err.code;
    });
  
  console.log(user)

  return {
    user: user,
    error: error,
  };
};

export const login = async (email: string, password: string) => {
  let user = {} as any;
  let error = {} as any;

  if (email === "") {
    error = "auth/no-email";
    return {
      user,
      error,
    };
  }
  if (password === "") {
    error = "auth/no-password";
    return {
      user,
      error,
    };
  }

  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      user = userCredential.user;
      // ...
    })
    .catch((err) => {
      error = err.code;
      console.log(error);
    });
  return {
    user: user,
    error: error,
  };
};

export const logout = async () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      return "Success";
    })
    .catch((error) => {
      // An error happened.
      return error;
    });
};

export const passwordReset = async (email: string) => {
  let error = {} as any;
  sendPasswordResetEmail(auth, email).catch((err) => {
    error = err;
  });
  return error;
};

// Important: To delete a user, the user must have signed in recently.
export const deleteMe = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  //@ts-ignore
  deleteUser(user)
    .then(() => {
      // User deleted.
    })
    .catch((error) => {
      return error.code;
    });
};
export const signin = async (
  email: string,
  password: string,
  confirmPassword: string
) => {
  let user = {} as any;
  let error = {} as any;

  if (password !== confirmPassword) {
    error = "auth/passwords-not-same";
    return {
      user,
      error,
    };
  }

  if (email === "") {
    error = "auth/no-email";
    return {
      user,
      error,
    };
  }
  if (password === "") {
    error = "auth/no-password";
    return {
      user,
      error,
    };
  }

  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      user = userCredential.user;
      sendEmailVerification(user);
    })
    .catch((err) => {
      error = err.code;
    });

  return {
    user,
    error,
  };
};

export const currentUser = (): User => {
  return auth.currentUser as User;
};
 
export const updateUriAndName = (url: string) => {
  updateProfile(currentUser(), {
    photoURL: url,
    displayName: "Test 2",
  });
};

export function checkAuth(user: JSON) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      return true;
      // ...
    } else {
      // User is signed out
      // ...
      return false;
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
