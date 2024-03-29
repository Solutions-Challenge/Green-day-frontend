import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { osName } from "expo-device";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  StatusBar,
  Text,
  View,
  Image,
  Animated,
  StyleSheet,
  ListRenderItem,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Svg, { Rect } from "react-native-svg";
import { GoBack } from "../components/goBack";
import useColorScheme from "../hooks/useColorScheme";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ExpandImageScreen = ({ navigation }: any) => {
  const route = useRoute();
  let flipPosition: any =
    osName === "Android" ? (StatusBar.currentHeight as number) : 30;

  const { item }: any = route.params;

  const uri = item.image.uri;
  const multi = item.multi;

  const colorScheme = useColorScheme();
  const [ifRender, setIfRender] = useState(false);

  const [index, setIndex] = useState(0);

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 70,
    minimumViewTime: 100,
  });
  let onViewableItemsChanged = useRef(({ changed }: any) => {
    setIndex(changed[0].key);
  });

  const scrollX = new Animated.Value(0);
  let position = Animated.divide(scrollX, windowWidth);

  const goBack = (name: string) => {
    navigation.navigate("Maps", {
      material: name,
    });
  };

  const darkenRGBA = (str: string) => {
    let temp = str.split(",")
    temp[3] = "1)"
    let ans = temp.join(",")
    return ans
  };

  useEffect(() => {
    (async () => {
      let object;
      for (let i = 0; i < item.multi.length; i++) {
        object = item.multi[i];

        object.displayName = object.displayName.replace(/_/g, " ");

        const words = object.displayName.split(" ");

        for (let i = 0; i < words.length; i++) {
          words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }

        object.displayName = words.join(" ");
      }
      setIfRender(true);
    })();
  }, []);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const renderItem: ListRenderItem<any> = useCallback(
    ({ item }) => {
      return (
        <View style={styles.cardView}>
          <ImageBackground
            source={{ uri: uri }}
            style={{
              height: imageWidth,
              width: imageWidth,
              alignSelf: "center",
            }}
            imageStyle={{ borderRadius: 10 }}
          >
            <View style={styles.textView}>
              <Text style={styles.itemTitle}>{item.displayName}</Text>
            </View>
            <Svg width={imageWidth} height={imageWidth}>
              <Rect
                key={index}
                rx={5}
                fill={item.ml.color || "rgba(255, 255, 255, .2)"}
                x={imageWidth * item.imageObjectDetection.boundingBox.normalizedVertices[0].x || 0}
                y={imageWidth * item.imageObjectDetection.boundingBox.normalizedVertices[0].y || 0}
                width={
                  (imageWidth * item.imageObjectDetection.boundingBox.normalizedVertices[1].x || 0) -
                  (imageWidth * item.imageObjectDetection.boundingBox.normalizedVertices[0].x || 0)
                }
                height={
                  (imageWidth * item.imageObjectDetection.boundingBox.normalizedVertices[1].y || 0) -
                  (imageWidth * item.imageObjectDetection.boundingBox.normalizedVertices[0].y || 0)
                }
                stroke={darkenRGBA(item.ml.color || "rgba(255, 255, 255, .2)")}
                strokeWidth={1}
              >

              </Rect>

            </Svg>
          </ImageBackground>
        </View>
      );
    },
    [ifRender]
  );

  const imageWidth = windowWidth - 20;
  return (
    <ScrollView>
      <View
        style={{
          backgroundColor: colorScheme === "dark" ? "#181818" : "white",
          display: "flex",
          marginTop: flipPosition + 100,
          paddingBottom: 20,
          borderRadius: 10,
        }}
      >
        <FlatList
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={viewConfigRef.current}
          data={item.multi}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled
          scrollEnabled
          snapToAlignment="center"
          scrollEventThrottle={16}
          decelerationRate={"fast"}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
        />

        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          {item.multi.map((_: any, i: any) => {
            let opacity = position.interpolate({
              inputRange: [i - 1, i, i + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });

            return (
              <>
                <Animated.View
                  key={i}
                  style={{
                    opacity,
                    height: 10,
                    width: 10,
                    backgroundColor: "#595959",
                    margin: 8,
                    borderRadius: 5,
                  }}
                />
              </>
            );
          })}
        </View>
        <View style={{ alignItems: "center", marginVertical: 40 }}>
          <View>
            <TouchableOpacity
              style={{
                height: 40,
                paddingHorizontal: 20,
                borderRadius: 20,
                backgroundColor: "white",
                flexDirection: "row",
              }}
              onPress={() => {
                goBack(item.multi[index].ml.name);
              }}
            >
              <Image
                style={{
                  width: 30,
                  height: 30,
                  marginRight: 5,
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
                source={{
                  uri: item.multi[index].ml.icon,
                }}
              />
              <Text
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
              >
                {item.multi[index].ml.name}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {"info" in item.multi[index].ml && (
          <View
            style={{
              borderColor: "#246EE9",
              borderWidth: 2,
              borderRadius: 10,
              marginHorizontal: 10,
              padding: 20,
              flexDirection: "column",
            }}
          >
            <AntDesign
              name="infocirlceo"
              size={24}
              color="#245EE9"
              style={{ marginBottom: 10 }}
            />
            <Text style={{ color: colorScheme === "dark" ? "white" : "black" }}>
              {item.multi[index].ml.info}
            </Text>
          </View>
        )}
      </View>
      <GoBack />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  recycleButton: {
    backgroundColor: "#190c8d",
    fontSize: 20,
    fontWeight: "600",
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 30,
    width: 130,
  },
  chipsItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    height: 35,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  cardView: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  textView: {
    position: "absolute",
    bottom: 10,
    margin: 10,
    left: 5,
  },
  image: {
    width: windowWidth - 20,
    borderRadius: 10,
    flex: 1,
    resizeMode: "cover",
  },
  itemTitle: {
    color: "white",
    fontSize: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0.8, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 3,
    marginBottom: 5,
    fontWeight: "bold",
    elevation: 5,
  },
  itemDescription: {
    color: "white",
    fontSize: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0.8, height: 0.8 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default ExpandImageScreen;
