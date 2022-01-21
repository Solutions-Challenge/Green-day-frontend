import { useNavigation } from "@react-navigation/native"
import React from "react"
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity, View, Text } from "react-native"
import { TextInput } from "react-native-paper"

export const PasswordSignIn = ({ placeholder, reveal, setReveal, setPassword }: any) => {
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
                    right={<TextInput.Icon name={reveal ? "eye" : "eye-off"} onPress={() => { setReveal(!reveal) }} />}
                >
                </TextInput>
            </View>
        </View>
    )
}

export const GeneralSignIn = ({ placeholder, set, icon }: any) => {
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
                    right={<TextInput.Icon name={() => icon} />}
                >
                </TextInput>
            </View>
        </View>
    )
}

export const SubmitButton = (props:any) => {
    const navigation = useNavigation()
    return (
        <View style={styles.buttonStyle}>
            <TouchableOpacity style={styles.buttonDesign} onPress={() => {
                if (props.submission==="Register") {
                    console.log(props)
                } else if (props.submission==="Login") {
                    console.log(props)
                }
            }}>
                <Text style={{ marginTop: 'auto', marginBottom: 'auto', color: 'white' }}>REGISTER NOW</Text>
            </TouchableOpacity>
        </View>
    )
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
        marginTop: 30,
        marginLeft: 15,
        marginRight: 15
    },
})
