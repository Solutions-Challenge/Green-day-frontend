import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { osName } from "expo-device";
import React, { useContext } from "react";
import { StatusBar, TouchableOpacity } from "react-native";
import ImageContext from "../hooks/imageContext";
import useColorScheme from "../hooks/useColorScheme";
import UserProfile from "./UserProfile";

export const OpenDrawer = ({showPic}:any) => {
  const navigation:any = useNavigation()
  const [profileUri, setProfileUri] = useContext(ImageContext).profileUri;
  const ColorScheme = useColorScheme()
  let flipPosition: any =
  osName === "Android" ? (StatusBar.currentHeight as number) : 30;
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.openDrawer();
      }}
      style={{ position: "absolute", top: flipPosition, left: 20 }}
    >
    {showPic ?
        <UserProfile
        uri={profileUri}
        navigation={navigation}
        hideCameraEdit={true}
        width={40}
        height={40}
        />
        :
        <Ionicons name="ios-arrow-back-sharp" size={30} color={ColorScheme === "dark" ? "white" : "black"} style={{marginVertical: 20}} />
    }
    </TouchableOpacity>
  );
};
