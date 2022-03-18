import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { osName } from "expo-device";
import React from "react";
import { View, TouchableOpacity, StatusBar } from "react-native";

export const GoBack = () => {
  const navigation = useNavigation();
  let flipPosition: any =
    osName === "Android" ? (StatusBar.currentHeight as number) : 30;
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <View
      style={{
        position: "absolute",
        top: flipPosition + 30,
        left: 10,
        backgroundColor: "black",
        borderRadius: 60,
      }}
    >
      <TouchableOpacity onPress={goBack}>
        <Ionicons name="ios-arrow-back-sharp" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};
