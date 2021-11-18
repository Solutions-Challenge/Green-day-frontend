/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Dimensions, Pressable, TouchableOpacity, View } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabOneScreen from '../screens/TabOneScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import CameraScreen from '../screens/CameraScreen';
import MapsScreen from '../screens/MapsScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { osName } from 'expo-device';
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

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<any>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
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
  return ( 
      <BottomTab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme].tint,
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            height: 60
          }
        }}
       
      >
        <BottomTab.Screen
          name="Home"
          component={TabOneScreen}
          options={() => ({
            title: 'Home',
            tabBarIcon: ({ color }) => 
              <View style={{position: 'absolute', top: 10, left: windowWidth / 6}}>
                <AntDesign name="home" size={24} color={color} />
              </View>,
            headerRight: () => (
              <Pressable
                style={({ pressed }) => ({
                  opacity: pressed ? 0.5 : 1,
                })}>
                <FontAwesome
                  name="info-circle"
                  size={25}
                  color={Colors[colorScheme].text}
                  style={{ marginRight: 15 }}
                />
              </Pressable>
            ),
          })}
        />
        <BottomTab.Screen
          name="Pic"
          component={CameraScreen}
          options={() => ({
            title: 'Pic',
            tabBarIcon: () =>
              <Feather
                name="camera"
                size={44}
                color="white"
                style={{
                  position: 'absolute',
                  top: 11,
                }}
              />,

            tabBarButton: (props) =>
              <View style={{position: 'absolute', top: -5, left: windowWidth / 2 - 35}}>
                <TouchableOpacity onPress={() => { navigation.navigate('Pic') }}
                  style={{
                    top: -30,
                  }}
                >
                  <View
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 35,
                      backgroundColor: "#246EE9",
                    }}
                  >
                    {props.children}
                  </View>
                </TouchableOpacity>
              </View>

          })}
        />
        <BottomTab.Screen
          name="Maps"
          component={MapsScreen}
          options={() => ({
            title: 'Maps',
            tabBarButton: (props) =>
            <View style={{position: 'absolute', top: 10, left: windowWidth * (5/6)}}>
              <TouchableOpacity onPress={() => { navigation.navigate('Maps') }}>
                <MaterialCommunityIcons name="google-maps" size={24} color="white" />
              </TouchableOpacity>
            </View>

          })}
        />
      </BottomTab.Navigator>
   
  )
}


function BottomTabNavigator() {

  return (

    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >

      <Stack.Screen name="Start" component={HomeTabs} />
      <Stack.Screen name="Pic" component={CameraScreen} />
      <Stack.Screen name="Maps" component={MapsScreen} />

    </Stack.Navigator>




  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

 // #03C04A (emerald Green)
 // #246EE9 (royal Blue)