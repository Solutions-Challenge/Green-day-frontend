import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, KeyboardAvoidingView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { handleGoogleSignIn } from '../../api/Auth';
import AuthButton from '../../components/AuthButton';
import { login } from '../../api/firebase';
import { PasswordSignIn, GeneralSignIn, SubmitButton } from '../../components/TextInputSignIn';

export default function LoginScreen() {
  const navigation = useNavigation()

  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [reveal, setReveal] = useState(false)
  
  return (

    <View style={styles.container}>
      <View style={styles.Middle}>
        <Text style={styles.LoginText}>Login</Text>
      </View>
      <View style={styles.text2}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")} >
          <Text style={styles.signupText}> Sign up</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView>
        <GeneralSignIn placeholder={"Username or Email: "} icon={<FontAwesome name={'user'} size={24} />} set={setUsername} />
        <PasswordSignIn placeholder={"Password: "} reveal={reveal} setReveal={setReveal} setPassword={setPassword} />
      </KeyboardAvoidingView>

      <SubmitButton submission={"Login"} userNameOrEmail={username} password={password} />

      <View style={styles.lineStyle}>
        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
        <View>
          <Text style={{ width: 50, textAlign: 'center' }}>Or</Text>
        </View>
        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
      </View>

      <View style={styles.boxStyle}>
        <View style={{ flexDirection: 'column' }}>
          <AuthButton uri={"https://www.transparentpng.com/thumb/google-logo/colorful-google-logo-transparent-clipart-download-u3DWLj.png"} text={"Sign in with Google"} funct={handleGoogleSignIn} />
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
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
    fontWeight: 'bold'
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