/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { Feather, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigation,
} from "@react-navigation/native";
import * as React from "react";
import {
  ColorSchemeName,
  Platform,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { RootTabParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import CameraScreen from "../screens/CameraScreen";
import MapsScreen from "../screens/MapsScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ExpandImageScreen from "../screens/ExpandImageScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import ForgetPasswordScreen from "../screens/Auth/ForgetPasswordScreen";
import { useContext, useEffect, useRef } from "react";
import VerifyScreen from "../screens/Auth/VerifyScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import UserProfile from "../components/UserProfile";
import ImageContext from "../hooks/imageContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth, currentUser, logout } from "../api/Auth";
import { Accuracy, getCurrentPositionAsync } from "expo-location";
import BottomSheet from "reanimated-bottom-sheet";
import MapPicScreen from "../screens/MapPicScreen";
import MapMarkerScreen from "../screens/mapMarkerScreen";
import ListScreen from "../screens/ListScreen";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const navigation = useNavigation();
  useEffect(() => {
    (async () => {
      const r: any = await AsyncStorage.getItem("remember");
      const remember = JSON.parse(r);
      await onAuthStateChanged(auth, (user) => {
        if (user === null || !remember.remember) {
          navigation.navigate("Register");
          navigation.reset({
            index: 0,
            routes: [{ name: "Register" }],
          });
        }
      });
    })();
  }, []);

  return (
    <>
      <Stack.Navigator
        initialRouteName="Drawer"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Drawer" component={DrawerTabs} />
        <Stack.Screen
          name="Pic"
          component={CameraScreen}
          initialParams={{ purpose: "" }}
        />
        <Stack.Screen name="Details" component={ExpandImageScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
        <Stack.Screen name="Verify" component={VerifyScreen} />
        <Stack.Screen
          name="MapPic"
          component={MapPicScreen}
          initialParams={{ pic: "", lat: 0, lng: 0 }}
        />
      </Stack.Navigator>
    </>
  );
}

const Drawer = createDrawerNavigator();

const DrawerTabs = () => {
  const [profileUri] = useContext(ImageContext).profileUri;

  return (
    <>
      <RenderBottomSheet />
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerType: "front",
          swipeEdgeWidth: 50,
        }}
        drawerContent={(props) => {
          return (
            <DrawerContentScrollView {...props}>
              <UserProfile
                uri={profileUri}
                width={60}
                height={60}
                hideCameraEdit={true}
              />
              <DrawerItemList {...props} />
            </DrawerContentScrollView>
          );
        }}
      >
        <Drawer.Screen name={"Home"} component={HomeTabs} />
        <Drawer.Screen name={"Profile"} component={UserProfileScreen} />
        <Drawer.Screen name={"Markers"} component={MapMarkerScreen} />
      </Drawer.Navigator>
    </>
  );
};

const RenderBottomSheet = () => {
  const [bs, setBs] = useContext(ImageContext).bs;
  setBs(useRef(null));
  const [, setVisible] = useContext(ImageContext).visible;
  const [, setAddingMarker] = useContext(ImageContext).addingMarker;
  const colorScheme = useColorScheme();
  let navigation = useNavigation();
  const [profileUri, setProfileUri] = useContext(ImageContext).profileUri;
  const [fullName, setFullName] = useContext(ImageContext).fullName;
  return (
    <BottomSheet
      ref={bs}
      snapPoints={[350, -700]}
      initialSnap={1}
      renderContent={() => (
        <View
          style={[
            styles.panel,
            {
              paddingBottom: 600,
              backgroundColor: colorScheme === "dark" ? "#181818" : "white",
            },
          ]}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.panelTitle,
                {
                  color: colorScheme === "dark" ? "white" : "black",
                  marginBottom: 10,
                },
              ]}
            >
              {currentUser() && currentUser().isAnonymous ? "Adding Markers Requires Sign In":"Add Your Own Markers"}
            </Text>
          </View>
          {currentUser() && currentUser().isAnonymous ? (
            <TouchableOpacity
              style={styles.panelButton}
              onPress={async () => {
                AsyncStorage.removeItem("user");
                AsyncStorage.removeItem("multi");
                setProfileUri("Guest");
                setFullName("");
                await logout();
              }}
            >
              <Text style={styles.panelButtonTitle}>
                Sign In to Get Full Features
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.panelButton}
              onPress={async () => {
                await getCurrentPositionAsync({
                  accuracy: Accuracy.Highest,
                }).then((res) => {
                  setAddingMarker({
                    latitude: res.coords.latitude,
                    longitude: res.coords.longitude,
                  });
                });
                setVisible(false);
                bs?.current?.snapTo(1);
                //@ts-ignore
                navigation.navigate("Pic", { purpose: "update map picture" });
              }}
            >
              <Text style={styles.panelButtonTitle}>
                Use Your Current Location
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.panelButton}
            onPress={() => {
              bs?.current?.snapTo(1);
            }}
          >
            <Text style={styles.panelButtonTitle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      renderHeader={() => (
        <View
          style={[
            styles.header,
            { backgroundColor: colorScheme === "dark" ? "#181818" : "white" },
          ]}
        >
          <View style={styles.panelHeader}>
            <View
              style={[
                styles.panelHandle,
                {
                  backgroundColor:
                    colorScheme === "dark" ? "white" : "#00000040",
                },
              ]}
            />
          </View>
        </View>
      )}
      enabledGestureInteraction={true}
      enabledInnerScrolling={false}
      enabledContentGestureInteraction={false}
    />
  );
};

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

const HomeTabs = ({ navigation }: any) => {
  const colorScheme = useColorScheme();
  return (
    <>
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
            position: "absolute",
          },
        }}
      >
        <BottomTab.Screen
          name="Start"
          component={HomeScreen}
          options={() => ({
            title: "Start",
            tabBarIcon: ({ focused }) => (
              <View style={{ marginTop: Platform.OS === "ios" ? 12 : 0 }}>
                <Ionicons
                  name="home-outline"
                  size={30}
                  color={
                    focused
                      ? colorScheme === "dark"
                        ? "#fff"
                        : "#e32f45"
                      : "#748c94"
                  }
                />
              </View>
            ),
          })}
        />

        <BottomTab.Screen
          name="Pic"
          component={CameraScreen}
          // @ts-ignore
          initialParams={{ purpose: "" }}
          options={() => ({
            title: "Pic",
            tabBarIcon: () => {
              return (
                <View style={{ marginTop: Platform.OS === "ios" ? 12 : 0 }}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Pic");
                    }}
                    style={{
                      shadowColor: "#7F5DF0",
                      shadowOffset: { width: 0, height: 10 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.5,
                      elevation: 5,
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
                          alignSelf: "center",
                          marginTop: "auto",
                          marginBottom: "auto",
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              );
            },
          })}
        />
        <BottomTab.Screen
          name="Maps"
          component={MapsScreen}
          // @ts-ignore
          initialParams={{ material: "" }}
          options={() => ({
            title: "Maps",
            tabBarIcon: ({ focused }) => {
              return (
                <View style={{ marginTop: Platform.OS === "ios" ? 12 : 0 }}>
                  <MaterialCommunityIcons
                    name="google-maps"
                    size={30}
                    color={
                      focused
                        ? colorScheme === "dark"
                          ? "#fff"
                          : "#e32f45"
                        : "#748c94"
                    }
                  />
                </View>
              );
            },
          })}
        />
      </BottomTab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#FF6347",
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
});
