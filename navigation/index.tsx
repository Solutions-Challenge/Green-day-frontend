/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { AntDesign, Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { NavigationContainer, DefaultTheme, DarkTheme, useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { ColorSchemeName, Dimensions, Platform, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { RootTabParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import CameraScreen from '../screens/CameraScreen';
import MapsScreen from '../screens/MapsScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ExpandImageScreen from '../screens/ExpandImageScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgetPasswordScreen from '../screens/Auth/ForgetPasswordScreen';
import { useContext, useEffect } from 'react';
import VerifyScreen from '../screens/Auth/VerifyScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import ImageContext from '../hooks/imageContext';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const navigation = useNavigation()
  const [showPicButton,] = useContext(ImageContext).showPicButton
  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem("user")
      if (user === null) {
        navigation.navigate("Register")
        navigation.reset({
          index: 0,
          routes: [{ name: 'Register' }],
        });
      }
    })();
  }, []);

  return (<>
    <Stack.Navigator initialRouteName={"Home"} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={MaterialTabs} />
      <Stack.Screen name="Pic" component={CameraScreen} initialParams={{ purpose: "" }} />
      <Stack.Screen name="Details" component={ExpandImageScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
      <Stack.Screen name="Verify" component={VerifyScreen} />
    </Stack.Navigator>
    {  showPicButton &&
      <View style={{ justifyContent: 'center', position: 'absolute', bottom: 60, right: 20 }}>
        <TouchableOpacity onPress={() => { navigation.navigate("Pic") }}
          style={{
            shadowColor: '#7F5DF0',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 3.5,
            elevation: 5
          }}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 35,
              backgroundColor: "#246EE9",
            }}
          >
            <Feather
              name="camera"
              size={40}
              color="white"
              style={{
                alignSelf: 'center',
                marginTop: 'auto',
                marginBottom: 'auto'
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    }
  </>);
}


const MaterialTab = createMaterialTopTabNavigator()

const MaterialTabs = ({ navigation }: any) => {
  const colorScheme = useColorScheme();
  return (
    <MaterialTab.Navigator
      initialRouteName='Start'
      tabBarPosition='bottom'
      style={{ marginTop: 0 }}
      initialLayout={{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
      }}
      screenOptions={{
        tabBarIconStyle: { height: 30, width: 30 }
      }}
    >
      <MaterialTab.Screen
        name="Start"
        component={HomeScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return (
              <AntDesign name="home" size={30} color={focused ? colorScheme === "dark" ? '#fff' : '#e32f45' : '#748c94'} />
            )
          }
        }}
      />

      <MaterialTab.Screen
        name="UserProfile"
        component={UserProfileScreen}
        initialParams={{ material: "" }}
        options={{
          title: 'User Profile',
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return (
              <AntDesign name="user" size={30} color={focused ? colorScheme === "dark" ? '#fff' : '#e32f45' : '#748c94'} s />
            )
          }
        }}
      />

      <MaterialTab.Screen
        name="Maps"
        component={MapsScreen}
        initialParams={{ material: "" }}
        options={{
          title: 'Map',
          swipeEnabled: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return (
              <MaterialCommunityIcons name="google-maps" size={30} color={focused ? colorScheme === "dark" ? '#fff' : '#e32f45' : '#748c94'} />
            )
          }
        }}
      />

    </MaterialTab.Navigator>
  )
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

const HomeTabs = ({ navigation }: any) => {
  const colorScheme = useColorScheme();
  return (<>
    <BottomTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: 70,
          bottom: Platform.OS === "android" ? 30 : 60,
          borderRadius: 15,
          left: 20,
          right: 20,
          position: 'absolute'
        }
      }}
    >
      <BottomTab.Screen
        name="Start"
        component={HomeScreen}
        options={() => ({
          title: 'Start',
          tabBarIcon: ({ focused }) =>
            <View style={{ justifyContent: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
              <AntDesign name="home" size={30} color={focused ? colorScheme === "dark" ? '#fff' : '#e32f45' : '#748c94'} />
            </View>
        })}
      />

      <BottomTab.Screen
        name="Pic"
        component={CameraScreen}
        // @ts-ignore
        initialParams={{ purpose: "" }}
        options={() => ({

          title: 'Pic',
          tabBarIcon: () => {
            return (
              <View style={{ justifyContent: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
                <TouchableOpacity onPress={() => { navigation.navigate('Pic') }}
                  style={{
                    shadowColor: '#7F5DF0',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.5,
                    elevation: 5
                  }}
                >
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 35,
                      backgroundColor: "#246EE9",
                    }}
                  >
                    <Feather
                      name="camera"
                      size={40}
                      color="white"
                      style={{
                        alignSelf: 'center',
                        marginTop: 'auto',
                        marginBottom: 'auto'
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )
          }
        })}
      />
      <BottomTab.Screen
        name="Maps"
        component={MapsScreen}
        // @ts-ignore
        initialParams={{ material: "" }}
        options={() => ({
          title: 'Maps',
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ justifyContent: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
                <MaterialCommunityIcons name="google-maps" size={30} color={focused ? colorScheme === "dark" ? '#fff' : '#e32f45' : '#748c94'} />
              </View>
            )
          }

        })}
      />
    </BottomTab.Navigator>
  </>)
}
