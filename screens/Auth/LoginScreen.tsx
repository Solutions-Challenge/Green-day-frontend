import React, { useContext, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, KeyboardAvoidingView } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PasswordSignIn, GeneralSignIn, SubmitButton } from '../../components/TextInputSignIn';
import AuthButtons from '../../components/AuthButton';
import { login } from '../../api/Auth';
import ImageContext from '../../hooks/imageContext';

export default function LoginScreen() {
  const navigation = useNavigation()

  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [reveal, setReveal] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useContext(ImageContext).error

  return (

    <View style={styles.container}>
      <View style={styles.Middle}>
        <Text style={styles.LoginText}>Login</Text>
      </View>
      <View style={styles.text2}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => {setError(""); navigation.navigate("Register")}} >
          <Text style={styles.signupText}> Sign up</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView>
        <GeneralSignIn placeholder={"Email: "} icon={<MaterialIcons name={'email'} size={24} />} set={setEmail} error={error} />
        <PasswordSignIn placeholder={"Password: "} reveal={reveal} setReveal={setReveal} setPassword={setPassword} error={error} />
      </KeyboardAvoidingView>

      <SubmitButton submission={"Login"} email={email} password={password} setRemember={setRemember} remember={remember} setError={setError} />

      <View style={styles.lineStyle}>
        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
        <View>
          <Text style={{ width: 50, textAlign: 'center' }}>Or</Text>
        </View>
        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
      </View>

      <AuthButtons />
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