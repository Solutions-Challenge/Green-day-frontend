import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GeneralSignIn, PasswordSignIn, SubmitButton } from '../../components/TextInputSignIn';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AuthButtons from '../../components/AuthButton';
import UserProfile from '../../components/UserProfile';
import ImageContext from '../../hooks/imageContext';

export default function RegisterScreen() {
  const navigation = useNavigation()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [email, setEmail] = useState("")
  const [reveal, setReveal] = useState(false)
  const [remember, setRemember] = useState(false)
  const [profileUri,] = useContext(ImageContext).profileUri
  const [error, setError] = useContext(ImageContext).error

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <View style={styles.Middle}>
          <Text style={styles.LoginText}>Signup</Text>
        </View>
        <View style={styles.text2}>
          <Text>Already have account? </Text>
          <TouchableOpacity onPress={() => {setError(""); navigation.navigate("Login")}} ><Text style={styles.signupText}> Login </Text></TouchableOpacity>
        </View>

        <UserProfile uri={profileUri === "" ? "guest":profileUri} navigation={navigation} />

        <GeneralSignIn placeholder={"Email: "} icon={<MaterialIcons name={'email'} size={24} />} set={setEmail} error={error} />
        <PasswordSignIn placeholder={"Password: "} reveal={reveal} setReveal={setReveal} setPassword={setPassword} error={error} />
        <PasswordSignIn placeholder={"Confirm Password: "} reveal={reveal} setReveal={setReveal} setPassword={setConfirmPassword} error={error} />

        <SubmitButton submission={"Register"} email={email} password={password} confirmPassword={confirmPassword} setRemember={setRemember} remember={remember} setError={setError} navigation={navigation} />

        <View style={styles.lineStyle}>
          <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
          <View>
            <Text style={{ width: 50, textAlign: 'center' }}>Or</Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
        </View>

        <AuthButtons navigation={navigation} remember={remember} />

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
  }
});