import { Ionicons } from "@expo/vector-icons"
import { osName } from "expo-device"
import React, { useState } from "react"
import { StatusBar, TouchableOpacity, View, StyleSheet, TextInput, Text } from "react-native"

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

    const handleSubmit = async() => {

        let data = {
            name,
            email,
            subject,
            message
        }


        const res = await fetch('http://100.64.56.31:4000/send_mail', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
        })
        
    }


    return (<>
        <View style={{ position: 'absolute', top: flipPosition + 30, left: 10, backgroundColor: 'black', borderRadius: 60 }}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name="ios-arrow-back-sharp" size={30} color="white" />
            </TouchableOpacity>
        </View>
        <View style={styles.container}>

            <View style={{ backgroundColor: '#EEEEEE', padding: 20, borderRadius: 3 }}>
                <TextInput placeholder="Name" style={styles.inputStyle} onChangeText={(res)=>setName(res)} />
                <TextInput placeholder="Email" style={styles.inputStyle} onChangeText={(res)=>setEmail(res)}  />
                <TextInput placeholder="Subject Line" style={styles.inputStyle} onChangeText={(res)=>setSubject(res)}  />
                <TextInput placeholder="Message" style={styles.inputStyle} onChangeText={(res)=>setMessage(res)}  />
                <TouchableOpacity style={styles.ButtonContainer} onPress={handleSubmit}>
                    <Text style={styles.ButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>
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
    }
});

export default FeedbackScreen