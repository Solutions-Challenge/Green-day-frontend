import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { osName } from "expo-device";
import React, { useContext, useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, KeyboardAvoidingView } from "react-native"
import { GeneralSignIn, SubmitButton } from "../../components/TextInputSignIn";
import ImageContext from "../../hooks/imageContext";

let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30

const ForgetPasswordScreen = ({ navigation }: any) => {
    const goBack = () => {
        navigation.goBack()
    }
    
    const [email, setEmail] = useState("")
    const [error, setError] = useContext(ImageContext).error

    return (<>
        <View style={styles.container}>
            <View style={styles.Middle}>
                <Text style={styles.LoginText}>Forget Password</Text>
            </View>
            <KeyboardAvoidingView>
                <GeneralSignIn placeholder={"Email: "} icon={<MaterialIcons name={'email'} size={24} />} set={setEmail} error={error} />
            </KeyboardAvoidingView>
            <SubmitButton submission={"Submit"} email={email} setError={setError} />

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
        backgroundColor: 'white'
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

export default ForgetPasswordScreen