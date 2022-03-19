import { Feather } from "@expo/vector-icons";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { osName } from "expo-device";
import React, { useEffect, useState } from "react";
import { Text, Dimensions, Linking, ImageBackground, View, StatusBar, TouchableOpacity as Touch } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { delete_trashcan, getUserMarkers } from "../api/Backend";
import { GoBack } from "../components/goBack";

const MapPicScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");
  let flipPosition = osName === "Android" ? (StatusBar.currentHeight as number) : 30;
  const isFocused = useIsFocused()

  const { pic, lat, lng, id }: any = route.params;

  const [ifUser, setIfUser] = useState("" as any);

  const fetchData = async () => {
    console.log('testing...')
    const data = await getUserMarkers();
    for (let i = 0; i < data.success.length; i++) {
        if (id === data.success[i]) {
            setIfUser(id)
            return;
        }
    }
  };

  useEffect(() => {
    (async () => {
        if(isFocused) {
            await fetchData();
        }
    })();
  }, [isFocused]);

  return (
    <SafeAreaView>
      <ImageBackground
        source={{ uri: pic }}
        style={{ height: height, width: width }}
      >
        {ifUser !== "" && <Touch
          style={{
            left: width - 50,
            top: flipPosition - 10,
            backgroundColor: 'white',
            width: 40,
            height: 40,
            borderRadius: 20,
          }}
          onPress={async () => {
            await delete_trashcan(ifUser);
            navigation.goBack()
          }}
        >
          <Feather name="trash-2" size={30} color="#fe6f5e" style={{alignSelf: 'center',marginTop: 'auto', marginBottom: 'auto'}} />
        </Touch>}

        <View style={{ top: ifUser !== "" ? height-140: height - 100, left: 20, width: 100 }}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
              );
            }}
          >
            <View
              style={{
                backgroundColor: "#246EE9",
                borderRadius: 10,
                height: 45,
                width: 100,
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  marginTop: "auto",
                  marginBottom: "auto",
                  color: "white",
                }}
              >
                Go Here
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <GoBack />
    </SafeAreaView>
  );
};

export default MapPicScreen;
