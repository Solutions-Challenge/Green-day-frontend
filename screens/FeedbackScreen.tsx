import { Ionicons } from "@expo/vector-icons"
import { osName } from "expo-device"
import React, { useContext, useEffect, useState } from "react"
import { StatusBar, TouchableOpacity, View, StyleSheet, TextInput, Text, Image, KeyboardAvoidingView, Platform } from "react-native"
import ImageContext from "../hooks/imageContext"
import useColorScheme from '../hooks/useColorScheme';
import * as RNFS from 'react-native-fs'
import FastImage from 'react-native-fast-image'
import * as FileSystem from 'expo-file-system';

let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30

const FeedbackScreen = ({ navigation }: any) => {
    const goBack = () => {
        navigation.navigate('Home')
    }

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useContext(ImageContext).isLoading
    const colorScheme = useColorScheme()
    const checkMarkGIF = '../assets/images/checkMark.gif'
    
    const [nameError, setNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [subjectError, setSubjectError] = useState(false)
    const [messageError, setMessageError] = useState(false)




    const handleSubmit = async () => {

        let data = {
            name,
            email,
            subject,
            message
        }

        let check = false

        if (name === '') {
            setNameError(true)
            check = true
        }
        else {
            setNameError(false)
        }

        if (email === '' || !email.includes('@')) {
            setEmailError(true)
            check = true
        }
        else {
            setEmailError(false)
        }

        if (subject === '') {
            setSubjectError(true)
            check = true
        }
        else {
            setSubjectError(false)
        }

        if (message === '') {
            setMessageError(true)
            check = true
        }
        else {
            setMessageError(false)
        }

        if (check) {
            return;
        }

        setIsLoading(true)

        const res = await fetch('http://100.64.56.31:4000/send_mail', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })

        setIsLoading(false)

        setName('')
        setEmail('')
        setSubject('')
        setMessage('')

        setSubmitted(true)

        setTimeout(() => {
            setSubmitted(false)
            goBack()
        }, 4400)

    }

    return (<>
        {submitted ?

            <View style={styles.container}>
                {/* style={{ width: 160, height: 160, borderRadius: 80, overflow: "hidden", overlayColor: colorScheme === "dark" ? "black" : "white" }} */}
                <Image source={require('../assets/images/checkMark.gif')} style={{ width: 320, height: 320 }} resizeMode={"contain"} />
                {/* <Text style={{ color: colorScheme === "dark" ? "white" : "black", fontSize: 30 }}>Thanks for the feedback!</Text> */}
            </View>

            :

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >

                <Text style={{ fontSize: 20, color: colorScheme === "dark" ? "white" : "black", paddingBottom: 10 }}>Send us some feedback of our product!</Text>
                <View style={{ backgroundColor: colorScheme === "dark" ? "#2a2a2a" : '#EEEEEE', padding: 20, borderRadius: 3 }}>
                    <TextInput placeholder="Name" placeholderTextColor={'black'} autoCompleteType={'name'} style={[styles.inputStyle, {borderColor: nameError ? 'red' : 'transparent'}]} onChangeText={(res) => setName(res)} />
                    <TextInput placeholder="Email" placeholderTextColor={'black'} autoCompleteType={'email'} keyboardType={'email-address'} textContentType={'emailAddress'} style={[styles.inputStyle, {borderColor: emailError ? 'red' : 'transparent'}]} onChangeText={(res) => setEmail(res)} />
                    <TextInput placeholder="Subject Line" placeholderTextColor={'black'} spellCheck={true} style={[styles.inputStyle, {borderColor: subjectError ? 'red' : 'transparent'}]} onChangeText={(res) => setSubject(res)} />
                    <TextInput placeholder="Message" placeholderTextColor={'black'} spellCheck={true} style={[styles.inputStyle, {borderColor: messageError ? 'red' : 'transparent'}]} onChangeText={(res) => setMessage(res)} />
                    <TouchableOpacity style={styles.ButtonContainer} onPress={handleSubmit}>
                        <Text style={styles.ButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

        }
        <View style={{ position: 'absolute', top: flipPosition + 30, left: 10, backgroundColor: 'black', borderRadius: 60 }}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name="ios-arrow-back-sharp" size={30} color="white" />
            </TouchableOpacity>
        </View>

    </>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },

    formLabel: {
        fontSize: 20,
        color: '#fff',
    },
    inputStyle: {
        marginTop: 20,
        width: 300,
        height: 40,
        paddingHorizontal: 10,
        borderRadius: 50,
        borderWidth: 3,
        backgroundColor: '#DCDCDC',
    },
    formText: {
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: 20,
    },
    text: {
        color: '#fff',
        fontSize: 20,
    },
    ButtonContainer: {
        elevation: 8,
        backgroundColor: "#009688",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginTop: 20
    },
    ButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
    diagonalBox: {
        transform: [{ skewY: '-30deg' }]
    }
});

export default FeedbackScreen