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
} from "firebase/auth";
export const auth = getAuth();

const provider = new GoogleAuthProvider();

export const handleGoogleSignIn = async (setUri: any) => {
  let user = {} as any
  let error = {} as any
  
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
      if (res.type === "success") {
        user = res.user
      }
    })
    .catch((err) => {
      error = err.code
    });

    return {
      user: user,
      error: error
    }
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
  let error = {} as any
  sendPasswordResetEmail(auth, email)
    .catch((err) => {
      error = err
    });
  return error
};

// Important: To delete a user, the user must have signed in recently.
export const deleteMe = async (email: string, password: string) => {
  const auth = getAuth();
  const user = auth.currentUser;

  //@ts-ignore
  deleteUser(user)
    .then(() => {
      // User deleted.
    })
    .catch((error) => {
      // An error ocurred
      // ...
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
      // Signed in
      user = userCredential.user;
    })
    .catch((err) => {
      error = err.code;
    });
  return {
    user: user,
    error: error,
  };
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
