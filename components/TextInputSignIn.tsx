import { useNavigation } from "@react-navigation/native"
import React from "react"
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity, View, Text } from "react-native"
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { HelperText, TextInput } from "react-native-paper"
import { login, signin } from '../api/Auth';

const errorCodesforPasswords = {
    "auth/passwords-not-same": "passwords do not match",
    "auth/weak-password": "weak password. Use at least 6 characters."
} as any

const errorCodesforEmail = {
    "auth/invalid-email": "invalid email",
    "auth/email-already-exists": "email already exists",
    "auth/email-already-in-use": "email is already in use",
    "auth/user-not-found": "email not found"
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
                    autoComplete={false}
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
    return (<>
        <View style={[styles.buttonStyle, { marginBottom: 0, marginTop: 20 }]}>
            <TouchableOpacity style={styles.buttonDesign} onPress={async () => {
                if (props.submission === "Register") {
                    const data = await signin(props.email, props.password, props.confirmPassword)
                    props.setError(data.error)
                } else if (props.submission === "Login") {
                    const data = await login(props.email, props.password)
                    props.setError(data.error)
                }
            }}>
                <Text style={{ marginTop: 'auto', marginBottom: 'auto', color: 'white' }}>{props.submission === "Register" ? "REGISTER" : "LOGIN"}</Text>
            </TouchableOpacity>
        </View>
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
            <Text style={{ alignContent: 'flex-end', color: "#026efd" }}>Forgot Password</Text>
        </View>
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
        marginRight: 15,
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
