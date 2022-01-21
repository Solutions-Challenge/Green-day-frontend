import * as Google from "expo-google-app-auth"

export const handleGoogleSignIn = async () => {
    const config = {
      androidClientId: "816316595942-qdl7p7g6cqgf6mem4c33q52u64tmmk73.apps.googleusercontent.com",
      iosClientId: "816316595942-1t8utcje5adcq2meiur0peup5o99qp15.apps.googleusercontent.com",
      scopes: ["profile", "email"]
    }

    await Google.logInAsync(config)
    .then((res)=>{
      // @ts-ignore
      const {type, user} = res 
      if (type === "success") {
        console.log("success")
        const {email, name, photoUrl} = user
        console.log(email, name, photoUrl)
      }
      else {
        console.log("canceled")
      }
    })
    .catch((err)=>{
      console.log(err)
    })
  }