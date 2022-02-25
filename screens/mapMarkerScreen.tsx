import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { osName } from "expo-device";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  delete_trashcan,
  getTrashCanImage,
  getUserMarkers,
  getUserTrashCans,
} from "../api/Backend";
import getEnvVars from "../environment";
import useColorScheme from "../hooks/useColorScheme";
const { STATISMAPSAPIKEY } = getEnvVars();

const MapMarkerScreen = () => {
  const isFocused = useIsFocused();
  const colorScheme = useColorScheme();
  const [data, setData] = useState([] as any);
  const [load, setLoad] = useState(false);
  const textColor = colorScheme === "dark" ? "white" : "black";
  const windowWidth = Dimensions.get("window").width;
  let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30
  const navigation: any = useNavigation()


  useEffect(() => {
    (async () => {
      setLoad(true);
      let ans = [];
      const data = await getUserMarkers();
      for (let i = 0; i < data.success.length; i++) {
        const trashCan = await getUserTrashCans(data.success[i]);
        const image = await getTrashCanImage(trashCan["image_id"]);
        const copy = {
          image_url: image.success["image_url"],
          ...trashCan,
        };
        ans.push(copy);
      }
      setData(ans);
      setLoad(false);
    })();
  }, [isFocused]);
  return (
    <SafeAreaView>
      {load ? (
        <ActivityIndicator
          style={{ width: 120, height: 140, alignContent: 'center', alignSelf: 'center', justifyContent: 'center' }}
          size="large"
          color="#246EE9"
        />
      ) : data.length == 0 ? (
        <View
          style={[
            styles.container,
            {
              backgroundColor: colorScheme === "dark" ? "#181818" : "#ffffff",
              height: 220,
              flexDirection: "column",
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 20,
            }}
          >
            <MaterialCommunityIcons
              name="map-marker-off"
              size={80}
              color={textColor}
            />
          </View>
          <Text style={{ color: textColor, fontSize: 30, textAlign: "center" }}>
            No User Markers were Found
          </Text>
        </View>
      ) : (
        data.map((e: any, index: number) => {
          return (
            <View
              key={index}
              style={[
                styles.container,
                {
                  backgroundColor:
                    colorScheme === "dark" ? "#181818" : "#ffffff",
                },
              ]}
            >
              <ImageBackground
                style={{
                  width: 120,
                  height: 140,
                  overflow: "hidden",
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                }}
                source={{ uri: e["image_url"] }}
              >
                <Text style={{ color: textColor, top: 120, left: 10 }}>
                  {e["date_taken"]}
                </Text>
              </ImageBackground>
              <Image
                style={{
                  width: 120,
                  height: 140,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                }}
                source={{
                  uri: `https://maps.googleapis.com/maps/api/staticmap?center=${e["latitude"]},${e["longitude"]}&zoom=20&size=400x400&maptype=roadmap&markers=color:blue%7Clabel:S%7C${e["latitude"]},${e["longitude"]}&key=${STATISMAPSAPIKEY}`,
                }}
              />
              <View style={{ width: windowWidth }}>
                <TouchableOpacity
                  style={{ left: windowWidth - 390, top: 50 }}
                  onPress={async () => {
                    await delete_trashcan(e["image_id"]);
                    let copy = [];
                    for (let i = 0; i < data.length; i++) {
                      if (data[i]["image_id"] !== e["image_id"]) {
                        copy.push(data[i]);
                      }
                    }
                    setData(copy);
                  }}
                >
                  <Feather name="trash-2" size={30} color="#fe6f5e" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
      <View
        style={{
          position: "absolute",
          top: flipPosition + 20,
          left: 20,
          backgroundColor: colorScheme === "dark" ? "black" : "white",
          borderRadius: 60,
          elevation: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.openDrawer();
          }}
        >
          <Ionicons
            name="ios-arrow-back-sharp"
            size={30}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 50,
    borderRadius: 10,
    shadowColor: "black",
    flexDirection: "row",
    height: 140,
  },
});

export default MapMarkerScreen;
