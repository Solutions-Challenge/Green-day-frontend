import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Input, NativeBaseProvider, Button, Icon, Box, Image, AspectRatio, Pressable, extendTheme } from 'native-base';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { handleGoogleSignIn } from '../../api/Auth';
import AuthButton from '../../components/AuthButton';
import { login } from '../../api/firebase';

export default function LoginScreen() {
  const navigation = useNavigation()

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <View style={styles.Middle}>
          <Text style={styles.LoginText}>Login</Text>
        </View>
        <View style={styles.text2}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")} ><Text style={styles.signupText}> Sign up</Text></TouchableOpacity>
        </View>

        {/* Username or Email Input Field */}
        <View style={styles.buttonStyle}>

          <View style={styles.emailInput}>
            <Input
              InputLeftElement={
                <Icon
                  as={<FontAwesome name="user" />}
                  size="sm"
                  m={2}
                  _light={{
                    color: "black",
                  }}
                  _dark={{
                    color: "gray.300",
                  }}
                />
              }
              variant="outline"
              placeholder="Username or Email"
              _light={{
                placeholderTextColor: "blueGray.400",
              }}
              _dark={{
                placeholderTextColor: "blueGray.50",
              }}

            />
          </View>
        </View>

        {/* Password Input Field */}
        <View style={styles.buttonStyleX}>

          <View style={styles.emailInput}>
            <Input
              InputLeftElement={
                <Icon
                  as={<FontAwesome5 name="key" />}
                  size="sm"
                  m={2}
                  _light={{
                    color: "black",
                  }}
                  _dark={{
                    color: "gray.300",
                  }}
                />
              }
              variant="outline"
              secureTextEntry={true}
              placeholder="Password"
              _light={{
                placeholderTextColor: "blueGray.400",
              }}
              _dark={{
                placeholderTextColor: "blueGray.50",
              }}
            />
          </View>
        </View>

        {/* Button */}
        <View style={styles.buttonStyle}>
          <Button style={styles.buttonDesign} onPress={() => {
            navigation.navigate("Home")
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          }}>
            LOGIN
          </Button>
        </View>

        {/* Line */}
        <View style={styles.lineStyle}>
          <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
          <View>
            <Text style={{ width: 50, textAlign: 'center' }}>Or</Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
        </View>

        {/* Box */}
        <View style={styles.boxStyle}>
          <View style={{ flexDirection: 'column' }}>
            <AuthButton uri={"https://www.transparentpng.com/thumb/google-logo/colorful-google-logo-transparent-clipart-download-u3DWLj.png"} text={"Sign in with Google"} funct={handleGoogleSignIn} />
          </View>
        </View>
        <StatusBar style="auto" />
      </View>
    </NativeBaseProvider>
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