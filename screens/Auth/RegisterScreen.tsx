import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { handleGoogleSignIn } from '../../api/Auth';
import AuthButton from '../../components/AuthButton';
import { GeneralSignIn, PasswordSignIn, SubmitButton } from '../../components/TextInputSignIn';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function RegisterScreen() {
  const navigation = useNavigation()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [reveal, setReveal] = useState(false)

  return (
    
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <View style={styles.Middle}>
          <Text style={styles.LoginText}>Signup</Text>
        </View>
        <View style={styles.text2}>
          <Text>Already have account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")} ><Text style={styles.signupText}> Login </Text></TouchableOpacity>
        </View>


        <GeneralSignIn placeholder={"Username: "} icon={<FontAwesome name={'user'} size={24} />} set={setUsername} />
        <GeneralSignIn placeholder={"Email: "} icon={<MaterialIcons name={'email'} size={24} />} set={setEmail} />
        <PasswordSignIn placeholder={"Password: "} reveal={reveal} setReveal={setReveal} setPassword={setPassword} />
        <PasswordSignIn placeholder={"Confirm Password: "} reveal={reveal} setReveal={setReveal} setPassword={setConfirmPassword} />

        <SubmitButton submission={"Register"} username={username} email={email} password={password} confirmPassword={confirmPassword} />

        <View style={styles.lineStyle}>
          <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
          <View>
            <Text style={{ width: 50, textAlign: 'center' }}>Or</Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
        </View>
  
        <View style={styles.boxStyle}>
          <View style={{ flexDirection: 'column' }}>
            <AuthButton uri={"https://i.imgur.com/Fq9Jab5.jpg"} text={"Sign in with Google"} funct={handleGoogleSignIn} />
          </View>
        </View>
        </KeyboardAwareScrollView>
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