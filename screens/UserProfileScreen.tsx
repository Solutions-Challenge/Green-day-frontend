import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { osName } from "expo-device";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { currentUser, deleteMe, logout } from "../api/Auth";
import { deleteUser } from "../api/Backend";
import { OpenDrawer } from "../components/openDrawer";
import UserProfile from "../components/UserProfile";
import ImageContext from "../hooks/imageContext";
import useColorScheme from "../hooks/useColorScheme";
import Modal from "react-native-modal";

const UserProfileScreen = () => {
  const navigation: any = useNavigation();
  const ColorScheme = useColorScheme();
  const [profileUri, setProfileUri] = useContext(ImageContext).profileUri;
  const [fullName, setFullName] = useContext(ImageContext).fullName;
  const textColor = ColorScheme === "dark" ? "white" : "black";
  const [ifVisible, setIfVisible] = useState(false);
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const toggle = () => {
    setIfVisible(!ifVisible);
  };

  return (
    <View style={styles.container}>
      <Modal
        isVisible={ifVisible}
        onBackButtonPress={() => toggle()}
        deviceWidth={width}
        deviceHeight={height}
      >
        <View
          style={{
            height: 250,
            backgroundColor: ColorScheme === "dark" ? "#181818" : "white",
            borderRadius: 10,
          }}
        >
          <View
            style={{
              padding: 20,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: textColor,
                fontSize: 22,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Are you sure you want to delete your account? All of your data
              associated with your account will be deleted.
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => {
                  toggle();
                }}
              >
                <View
                  style={[
                    styles.button,
                    {
                      paddingHorizontal: 5,
                      paddingVertical: 10,
                      width: 150,
                      borderWidth: 1,
                      backgroundColor: "transparent",
                      borderColor: "#AAAFB4",
                      marginRight: 5,
                    },
                  ]}
                >
                  <Text style={{ color: "#AAAFB4", fontSize: 20 }}>Cancel</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  toggle()
                  await AsyncStorage.removeItem("user");
                  await AsyncStorage.removeItem("multi");
                  await AsyncStorage.removeItem("remember");
                  await deleteUser();
                  await deleteMe();
                  setProfileUri("Guest");
                  setFullName("");
                }}
              >
                <View
                  style={[
                    styles.button,
                    {
                      paddingHorizontal: 5,
                      paddingVertical: 10,
                      width: 150,
                      backgroundColor: "#F07470",
                      marginLeft: 5,
                    },
                  ]}
                >
                  <Text style={{ color: "white", fontSize: 20 }}>DELETE</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View>
        <View style={styles.Middle}>
          <Text style={[styles.LoginText, { color: textColor }]}>Welcome</Text>
        </View>
        <UserProfile hideCameraEdit={fullName === "Guest" ? true : false} />
        <View style={styles.Middle}>
          <Text style={{ color: textColor }}>{fullName}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: 140,
              height: 50,
              borderRadius: 60,
              elevation: 5,
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                if (currentUser().isAnonymous) {
                  await AsyncStorage.removeItem("user");
                  await AsyncStorage.removeItem("multi");
                  await AsyncStorage.removeItem("remember");
                  await deleteUser();
                  await deleteMe();
                  setProfileUri("Guest");
                  setFullName("");
                }

                else {
                    await AsyncStorage.removeItem("user");
                    await AsyncStorage.removeItem("multi");
                    await AsyncStorage.removeItem("remember");
                    setProfileUri("Guest");
                    setFullName("");
                    await logout();
                }
              }}
            >
              <Text style={{ alignSelf: "center", marginTop: 15 }}>
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: "white",
              width: 140,
              height: 50,
              borderRadius: 60,
              elevation: 5,
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                toggle();
                // await AsyncStorage.removeItem("user")
                // await AsyncStorage.removeItem("multi")
                // await AsyncStorage.removeItem("remember")
                // await deleteUser()
                // await deleteMe()
                // setProfileUri("Guest");
                // setFullName("");
                // navigation.navigate("Register");
                // navigation.reset({
                //     index: 0,
                //     routes: [{ name: "Register" }],
                // });
              }}
            >
              <Text style={{ alignSelf: "center", marginTop: 15 }}>
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <OpenDrawer showPic={false} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  LoginText: {
    marginTop: 100,
    fontSize: 30,
    fontWeight: "bold",
  },
  Middle: {
    alignItems: "center",
    justifyContent: "center",
  },
  text2: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 5,
  },
  signupText: {
    fontWeight: "bold",
    color: "#026efd",
  },
  emailField: {
    marginTop: 30,
    marginLeft: 15,
  },
  emailInput: {
    marginTop: 10,
    marginRight: 5,
  },
  buttonStyle: {
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
  },
  buttonStyleX: {
    marginTop: 12,
    marginLeft: 15,
    marginRight: 15,
  },
  buttonDesign: {
    backgroundColor: "#026efd",
  },
  lineStyle: {
    flexDirection: "row",
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
    alignItems: "center",
  },
  imageStyle: {
    width: 80,
    height: 80,
    marginLeft: 20,
  },
  boxStyle: {
    flexDirection: "row",
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
    justifyContent: "space-around",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: 80,
    backgroundColor: "#190c8d",
  },
});

export default UserProfileScreen;
