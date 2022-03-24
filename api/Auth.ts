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
  sendEmailVerification,
  updateProfile,
  User,
  signInWithCredential,
  signInAnonymously,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import app from "./config/firebase-service";

export const auth = getAuth(app);

export const anonymousSignIn = async () => {
  let user = {} as any;
  let error = {} as any;

  await signInAnonymously(auth)
  .then((res)=>{
      user = res.user
  })
  .catch((err)=>{
    error = err
  })
  return {
    user,
    error
  }
}

export const handleGoogleSignIn = async () => {
  let user = {} as any;
  let error = {} as any;

  const config = {
    androidClientId:
      "15765189134-2uvjibunbcdje9ehscg1fcqi0k3j0v43.apps.googleusercontent.com",
    iosClientId:
      "15765189134-u5vlkk5ncmkl0lceg3pkd5t85rur7026.apps.googleusercontent.com",
    androidStandaloneAppClientId: 
      "15765189134-ims9odbajn23r1a4rspn2bfrms830jr4.apps.googleusercontent.com",
    iosStandaloneAppClientId:
      "15765189134-95danbaij05prgd321aoscb6igfpj8jt.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  };

  await Google.logInAsync(config)
    .then(async (res) => {
      if (res.type === "success") {
        const { idToken, accessToken } = res;
        const credential = GoogleAuthProvider.credential(idToken, accessToken);
        const data = await signInWithCredential(auth, credential);
        user = data.user;
      } else if (res.type === "cancel") {
        user = res.type;
      }
    })
    .catch((err) => {
      error = err.code;
    });

  return {
    user: user,
    error: error,
  };
};

export const login = async (
  email: string,
  password: string,
) => {
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
      user = userCredential.user;
    })
    .catch((e) => {
      error = e.code;
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

export const updateUri = async (url: string) => {
  await updateProfile(currentUser(), {
    photoURL: url,
  });
};

export const updateName = async (name: string) => {
  await updateProfile(currentUser(), {
    displayName: name,
  });
}

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