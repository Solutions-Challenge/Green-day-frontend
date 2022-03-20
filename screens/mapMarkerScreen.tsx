import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { osName } from "expo-device";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  FlatList,
  ScrollView,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { currentUser } from "../api/Auth";
import {
  delete_trashcan,
  getTrashCanImage,
  getUserMarkers,
  getUserTrashCans,
} from "../api/Backend";
import { OpenDrawer } from "../components/openDrawer";
import getEnvVars from "../environment";
import ImageContext from "../hooks/imageContext";
import useColorScheme from "../hooks/useColorScheme";
const { STATISMAPSAPIKEY } = getEnvVars();

const MapMarkerScreen = () => {
  const colorScheme = useColorScheme();
  const [data, setData] = useState([] as any);
  const [load, setLoad] = useState(false);
  const textColor = colorScheme === "dark" ? "white" : "black";
  let flipPosition: any =
    osName === "Android" ? (StatusBar.currentHeight as number) : 30;
  const navigation: any = useNavigation();

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const reload = async () => {
    setLoad(true);
    let ans = [];
    const data = await getUserMarkers();

    if ("error" in data) {
      setLoad(false);
      setData([]);
      return;
    }

    let trashCans = [];
    if (data.success.length > 0) {
      trashCans = await getUserTrashCans(data.success);
    }

    if (trashCans === "error" || trashCans.length === 0) {
      setLoad(false);
      setData([]);
      return;
    }

    let image_ids = [];

    for (let i = 0; i < trashCans.length; i++) {
      image_ids.push(trashCans[i]["image_id"]);
    }

    const images: any = await getTrashCanImage(image_ids);

    for (let i = 0; i < trashCans.length; i++) {
      const copy = {
        image_url: images.success[i],
        ...trashCans[i],
      };
      ans.push(copy);
    }
    setData(ans);
    setLoad(false);
  };

  useEffect(() => {
    (async () => {
      await reload();
    })();
  }, []);

  return (
    <SafeAreaView>
      {data.length == 0 ? (
        <ScrollView
          refreshControl={
            <RefreshControl
              enabled={!currentUser().isAnonymous}
              refreshing={!currentUser().isAnonymous ? load:false}
              onRefresh={() => reload()}
            />
          }
        >
          <View
            style={[
              styles.container,
              {
                backgroundColor: colorScheme === "dark" ? "#181818" : "#ffffff",
                height: 220,
                flexDirection: "column",
                marginTop: 120,
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
            <Text
              style={{ color: textColor, fontSize: 30, textAlign: "center" }}
            >
              {currentUser().isAnonymous
                ? "Sign In to Get Full Features"
                : "No User Markers were Found"}
            </Text>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          style={{ marginTop: 70 }}
          data={data}
          refreshControl={
            <RefreshControl
              enabled={true}
              refreshing={load}
              onRefresh={() => reload()}
            />
          }
          keyExtractor={keyExtractor}
          renderItem={(item: any) => {
            const e = item.item;
            return (
              <View
                style={[
                  styles.container,
                  {
                    backgroundColor:
                      colorScheme === "dark" ? "#181818" : "#ffffff",
                    width: 310,
                    alignSelf: "center",
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("MapPic", {
                      pic: e["image_url"],
                      lat: e["latitude"],
                      lng: e["longitude"],
                      id: e["image_id"],
                    });
                  }}
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
                    <Text
                      style={{
                        color: "white",
                        top: 120,
                        left: 25,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        borderTopLeftRadius: 10,
                        paddingLeft: 10,
                      }}
                    >
                      {e["date_taken"]}
                    </Text>
                  </ImageBackground>
                </TouchableOpacity>
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
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    marginLeft: "auto",
                    marginRight: 20,
                  }}
                >
                  <TouchableOpacity
                    style={{ marginBottom: 20 }}
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
                  <View
                    style={{
                      backgroundColor: "white",
                      borderRadius: 15,
                      padding: 5,
                    }}
                  >
                    <Image
                      style={{ width: 20, height: 20 }}
                      source={{ uri: e["recycling_types"][0] }}
                    />
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}

      {data.length !== 0 && (
        <View
          style={{ position: "absolute", top: flipPosition + 10, right: 20 }}
        >
          <Text
            style={{
              color: colorScheme === "dark" ? "white" : "black",
              fontSize: 40,
            }}
          >
            {data.length} Marker{data.length === 1 ? "" : "s"}
          </Text>
        </View>
      )}

      <OpenDrawer showPic={true} />
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
