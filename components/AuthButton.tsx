import React, { useContext } from "react"
import { TouchableOpacity, Text, View, Image, StyleSheet } from "react-native"
import { handleGoogleSignIn } from "../api/Auth"
import ImageContext from "../hooks/imageContext"

const AuthButton = ({ uri, text, funct }: any) => {
    const [u, setU] = useContext(ImageContext).uri
    return (
        <TouchableOpacity onPress={() => { 
            if (funct.name === "handleGoogleSignIn") {
                funct(setU)
            }
            }} style={{ marginBottom: 20 }} >
            <View style={{
                height: 60,
                flexDirection: 'row',
                paddingHorizontal: 20,
                alignItems: 'center',
                borderRadius: 10,
                backgroundColor: '#fff',
                shadowColor: "#000",
                shadowRadius: 5,
                shadowOpacity: 0.3,
                shadowOffset: { width: 2, height: -2 },
                elevation: 5
            }}>
                <Image
                    source={{
                        uri: uri,
                    }}
                    style={{ width: 40, height: 40 }}
                />
                <Text style={{ textAlignVertical: 'center', marginLeft: 20, color: "#757575", fontSize: 14, fontWeight: "500" }}>{text}</Text>

            </View>
        </TouchableOpacity>
    )
}


const AuthButtons = ({navigation}:any) => {
    const signInGuest = () => {
        navigation.navigate("Home")
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
    }
    return (
        <View style={styles.boxStyle}>
            <View style={{ flexDirection: 'column' }}>
                <AuthButton uri={"https://i.imgur.com/Fq9Jab5.jpg"} text={"Sign in with Google"} funct={handleGoogleSignIn} />
                <AuthButton uri={"https://i.imgur.com/JEMgjOK.png"} text={"Sign in as Guest"} funct={signInGuest} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    boxStyle: {
        flexDirection: 'row',
        marginTop: 30,
        marginLeft: 15,
        marginRight: 15,
        justifyContent: 'space-around'
    }
})

export default AuthButtons