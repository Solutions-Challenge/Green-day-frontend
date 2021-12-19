/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import * as React from 'react';
import { ColorSchemeName, Dimensions, Platform, TouchableOpacity, View } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { RootTabParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import CameraScreen from '../screens/CameraScreen';
import MapsScreen from '../screens/MapsScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import AuthScreen from '../screens/AuthScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import ExpandImageScreen from '../screens/ExpandImageScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const windowWidth = Dimensions.get('window').width;

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
  return (
      <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeTabs} />
        <Stack.Screen name="Pic" component={CameraScreen} />
        <Stack.Screen name="FeedBack" component={FeedbackScreen} />
        <Stack.Screen name="Details" component={ExpandImageScreen} />
      </Stack.Navigator>
  );
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
          bottom: Platform.OS === "android" ? 30:60,
          borderRadius: 15,
          left: 20,
          right: 20,
          position: 'absolute',
        }
      }}

    >
      <BottomTab.Screen
        name="Start"
        component={HomeScreen}
        options={() => ({
          title: 'Start',
          tabBarIcon: ({ focused }) =>
            <View style={{ justifyContent: 'center', marginTop: 'auto', marginBottom: 'auto', top: Platform.OS === 'ios' && windowWidth < 500 ? 15 : 0 }}>
              <AntDesign name="home" size={30} color={focused ? colorScheme === "dark" ? '#fff': '#e32f45' : '#748c94'} />
            </View>
        })}
      />

      <BottomTab.Screen
        name="Pic"
        component={CameraScreen}
        options={() => ({
          
          title: 'Pic',
          tabBarIcon: () => {
            return (
              <View style={{ justifyContent: 'center', marginTop: 'auto', marginBottom: 'auto', top: Platform.OS === 'ios' && windowWidth < 500 ? 15 : 0 }}>
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
        component={AuthScreen}
        options={() => ({
          title: 'Maps',
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ justifyContent: 'center', marginTop: 'auto', marginBottom: 'auto', top: Platform.OS === 'ios' && windowWidth < 500 ? 15 : 0 }}> 
                  <MaterialCommunityIcons name="google-maps" size={30} color={focused ? colorScheme === "dark" ? '#fff': '#e32f45' : '#748c94'} />
              </View>
            )
          }

        })}
      />
    </BottomTab.Navigator>
  </>)
}
