import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { osName } from 'expo-device';
import React, { useContext, useEffect, useState } from "react"
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { deleteMe } from '../api/Auth';
import UserProfile from "../components/UserProfile"
import ImageContext from '../hooks/imageContext';
import useColorScheme from '../hooks/useColorScheme';

const UserProfileScreen = () => {
    const navigation:any = useNavigation()
    const ColorScheme = useColorScheme()
    const [profileUri, setProfileUri] = useContext(ImageContext).profileUri
    const [name, setName] = useState("")
    const textColor = ColorScheme === "dark" ? "white" : "black"
    let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30


    useEffect(() => {
        (async () => {
            let data: any = await AsyncStorage.getItem("user")
            if (data !== null) {
                data = JSON.parse(data as string)
                setName(data.name)
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.Middle}>
                <Text style={[styles.LoginText, { color: textColor }]}>Welcome</Text>
            </View>
            <UserProfile uri={profileUri} navigation={navigation} hideCameraEdit={false} />
            <View style={styles.Middle}>
                <Text style={{ color: textColor }}>{name}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                <View style={{ backgroundColor: 'white', width: 140, height: 50, borderRadius: 60, elevation: 5 }}>
                    <TouchableOpacity onPress={() => {
                        AsyncStorage.removeItem("user")
                        AsyncStorage.removeItem("multi")
                        setProfileUri("")
                        navigation.navigate("Register")
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Register' }],
                        });
                    }}>
                        <Text style={{ alignSelf: 'center', marginTop: 15 }}>Log Out</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: 'white', width: 140, height: 50, borderRadius: 60, elevation: 5 }}>
                    <TouchableOpacity onPress={async () => {
                        await AsyncStorage.removeItem("user")
                        await AsyncStorage.removeItem("multi")
                        await deleteMe()
                        setProfileUri("")
                        navigation.navigate("Register")
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Register' }],
                        });
                    }}>
                        <Text style={{ alignSelf: 'center', marginTop: 15 }}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ position: 'absolute', top: flipPosition + 20, left: 20, backgroundColor: ColorScheme === "dark" ? "black":"white", borderRadius: 60, elevation: 5 }}>
                <TouchableOpacity onPress={()=>{navigation.openDrawer()}}>
                    <Ionicons name="ios-arrow-back-sharp" size={30} color={ColorScheme === "dark" ? "white":"black"} />
                </TouchableOpacity>
            </View>
        </View>
    )
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

export default UserProfileScreen