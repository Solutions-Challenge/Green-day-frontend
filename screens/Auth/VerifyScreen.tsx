import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { osName } from "expo-device"
import React, { useContext, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native"
import { currentUser } from "../../api/Auth"
import { SubmitButton } from "../../components/TextInputSignIn"
import ImageContext from "../../hooks/imageContext"


let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30


const VerifyScreen = () => {
    const navigation = useNavigation()
    const [profileUri,] = useContext(ImageContext).profileUri
    const [fullName,] = useContext(ImageContext).fullName
    const route = useRoute()
    const { password, remember }: any = route.params
    const goBack = () => {
        navigation.goBack()
    }

    const currentEmail = currentUser().email as string
    const [error, setError] = useState("")
    return (<>
        <View style={styles.container}>
            <View style={[styles.Middle, { marginBottom: 20 }]}>
                <Text style={styles.LoginText}>Verify Email</Text>
                <Text style={[styles.LoginText, { fontSize: 20, fontWeight: 'normal', paddingHorizontal: 30 }]}>
                    We've sent an email to <Text style={{ color: "#026efd" }}>{currentEmail}</Text> to verify your email address and activate your account.
                    The link will expire in 1 hour.
                </Text>
            </View>
            <SubmitButton name={fullName} submission={"Verify"} email={currentEmail} password={password} setError={setError} navigation={navigation} profileUri={profileUri} remember={remember} />

        </View>
        <View style={{ position: 'absolute', top: flipPosition + 30, left: 10, backgroundColor: 'white', borderRadius: 60, elevation: 5 }}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name="ios-arrow-back-sharp" size={30} color="black" />
            </TouchableOpacity>
        </View>
    </>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    LoginText: {
        marginTop: 100,
        fontSize: 30,
        fontWeight: 'bold',
    },
    Middle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text2: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 5
    },
    signupText: {
        fontWeight: 'bold',
        color: "#026efd"
    },
    emailField: {
        marginTop: 30,
        marginLeft: 15
    },
    emailInput: {
        marginTop: 10,
        marginRight: 5
    },
    buttonStyle: {
        marginTop: 30,
        marginLeft: 15,
        marginRight: 15
    },
    buttonStyleX: {
        marginTop: 12,
        marginLeft: 15,
        marginRight: 15
    },
    buttonDesign: {
        backgroundColor: '#026efd'
    },
    lineStyle: {
        flexDirection: 'row',
        marginTop: 30,
        marginLeft: 15,
        marginRight: 15,
        alignItems: 'center'
    },
    imageStyle: {
        width: 80,
        height: 80,
        marginLeft: 20,
    },
    boxStyle: {
        flexDirection: 'row',
        marginTop: 30,
        marginLeft: 15,
        marginRight: 15,
        justifyContent: 'space-around'
    },
});

export default VerifyScreen