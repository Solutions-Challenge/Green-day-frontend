import { useNavigation } from "@react-navigation/native"
import React, { useContext } from "react"
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity, View, Text } from "react-native"
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { HelperText, TextInput } from "react-native-paper"
import { currentUser, login, passwordReset, signin, updateName, updateUri } from '../api/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageContext from "../hooks/imageContext"

const errorCodesforPasswords = {
    "auth/wrong-password": "password is incorrect",
    "auth/passwords-not-same": "passwords do not match",
    "auth/weak-password": "weak password. Use at least 6 characters.",
    "auth/no-password": "Please enter a password"
} as any

const errorCodesforEmail = {
    "auth/invalid-email": "invalid email",
    "auth/email-already-exists": "email already exists",
    "auth/email-already-in-use": "email is already in use",
    "auth/user-not-found": "email not found",
    "auth/no-email": "Please enter an email"
} as any

export const PasswordSignIn = ({ placeholder, reveal, setReveal, setPassword, error }: any) => {
    let passwordError: string | undefined = errorCodesforPasswords[error]
    return (
        <View style={styles.buttonStyle}>
            <View style={styles.emailInput}>
                <TextInput
                    autoComplete={false}
                    onChangeText={(res) => setPassword(res)}
                    placeholder={placeholder}
                    secureTextEntry={reveal ? false : true}
                    placeholderTextColor={'black'}
                    mode={"outlined"}
                    multiline={false}
                    dense={true}
                    error={typeof (passwordError) !== "undefined"}
                    right={<TextInput.Icon name={reveal ? "eye" : "eye-off"} onPress={() => { setReveal(!reveal) }} />}
                />
            </View>
            {
                passwordError &&
                <HelperText type="error" onPressIn={() => { }} onPressOut={() => { }}>
                    <Text>
                        {passwordError}
                    </Text>
                </HelperText>
            }
        </View>
    )
}

export const GeneralSignIn = ({ placeholder, set, icon, error }: any) => {
    let emailError: string | undefined = errorCodesforEmail[error]
    return (
        <View style={styles.buttonStyle}>
            <View style={styles.emailInput}>
                <TextInput
                    autoComplete={"email"}
                    keyboardType={"email-address"}
                    textContentType={"emailAddress"}
                    onChangeText={(res) => set(res)}
                    placeholder={placeholder}
                    placeholderTextColor={'black'}
                    mode={"outlined"}
                    multiline={false}
                    dense={true}
                    error={typeof (emailError) !== "undefined"}
                    right={<TextInput.Icon name={() => icon} />}
                >
                </TextInput>
            </View>
            {emailError &&
                <HelperText type="error" onPressIn={() => { }} onPressOut={() => { }}>
                    <Text>
                        {emailError}
                    </Text>
                </HelperText>
            }
        </View>
    )
}

export const SubmitButton = (props: any) => {
    const [profileUri,] = useContext(ImageContext).profileUri
    return (<>
        <View style={[styles.buttonStyle, { marginBottom: 0, marginTop: 20 }]}>
            <TouchableOpacity style={styles.buttonDesign} onPress={async () => {
                let data = {} as any
                if (props.submission === "Register") {
                    data = await signin(props.email, props.password, props.confirmPassword)
                    await updateUri(profileUri)
                    await updateName(props.name)
                } else if (props.submission === "Login" || props.submission === "Verify") {
                    data = await login(props.email, props.password)
                } else if (props.submission === "Submit") {
                    data = await passwordReset(props.email)
                }
                props.setError(data.error)

                if (Object.keys(data.error).length === 0) {
                    if (props.submission === "Register" || props.submission === "Login") {
                        if (!currentUser().emailVerified) {
                            props.navigation.navigate("Verify", { password: props.password, remember: props.remember })
                        }
                        else {
                            if (props.remember === true) {
                                await AsyncStorage.setItem("remember", JSON.stringify({remember: true}))
                            }
                            props.navigation.navigate("Drawer")
                            props.navigation.reset({
                                index: 0,
                                routes: [{ name: 'Drawer' }],
                            });
                        }
                    }
                    if (props.submission === "Verify") {
                        if (currentUser().emailVerified) {
                            if (props.remember === true) {
                                await AsyncStorage.setItem("remember", JSON.stringify({remember: true}))
                            }
                            props.navigation.navigate("Drawer")
                            props.navigation.reset({
                                index: 0,
                                routes: [{ name: 'Drawer' }],
                            });
                        }
                    }

                }
            }}>
                <Text style={{ marginTop: 'auto', marginBottom: 'auto', color: 'white' }}>{props.submission}</Text>
            </TouchableOpacity>
        </View>
        {
            (props.submission != "Submit" && props.submission != "Verify") &&
            <View style={styles.checkBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <BouncyCheckbox
                        iconStyle={{ borderRadius: 5 }}
                        fillColor="#026efd"
                        size={20}
                        onPress={(isChecked: boolean) => { props.setRemember(isChecked) }}
                    />
                    <Text>Remember Me</Text>
                </View>
                <TouchableOpacity onPress={() => { props.navigation.navigate("ForgetPassword") }}>
                    <Text style={{ alignContent: 'flex-end', color: "#026efd" }}>Forgot Password</Text>
                </TouchableOpacity>
            </View>
        }
    </>)
}

const styles = StyleSheet.create({
    emailInput: {
        marginTop: 10,
        marginRight: 5
    },
    buttonDesign: {
        backgroundColor: '#026efd',
        height: 40,
        borderRadius: 5,
        alignItems: 'center'
    },
    buttonStyle: {
        marginLeft: 15,
        marginRight: 15
    },
    checkBox: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 15,
        justifyContent: "space-between"
    }
})
