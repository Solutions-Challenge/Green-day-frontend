import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  useColorScheme,
  StatusBar,
} from "react-native";
import dummyData from "../constants/dummyData";

import SearchBar from "../components/SearchBar";
import List from "../components/List";
import { Ionicons } from "@expo/vector-icons";
import ImageContext from "../hooks/imageContext";
import { osName } from "expo-device";
import UserProfile from "../components/UserProfile";

const ListScreen = ({ navigation }: any) => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [data, setData] = useState();
  const ColorScheme = useColorScheme();
  const [profileUri, setProfileUri] = useContext(ImageContext).profileUri;
  let flipPosition: any =
    osName === "Android" ? (StatusBar.currentHeight as number) : 30;

  useEffect(() => {
    const getData = async () => {
      // @ts-ignore
      setData(dummyData);
    };
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity
        onPress={() => {
          navigation.openDrawer();
        }}
        style={{ position: "absolute", top: flipPosition, left: 20 }}
      >
        <UserProfile
          uri={profileUri}
          navigation={navigation}
          hideCameraEdit={true}
          width={40}
          height={40}
        />
      </TouchableOpacity>
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        clicked={clicked}
        setClicked={setClicked}
      />

      <List
        searchPhrase={searchPhrase}
        data={data}
        setClicked={setClicked}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

export default ListScreen;

const styles = StyleSheet.create({
  root: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    width: "100%",
    marginTop: 20,
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: "10%",
  },
});
