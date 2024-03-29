import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  Platform,
  ImageBackground,
} from "react-native";
import { Camera } from "expo-camera";
import { osName } from "expo-device";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import ImageContext from "../hooks/imageContext";
import {
  ImageResult,
  manipulateAsync,
  SaveFormat,
} from "expo-image-manipulator";
import { Dimensions } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Col, Row, Grid } from "react-native-easy-grid";
import { PinchGestureHandler } from "react-native-gesture-handler";
import Svg, { Rect } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getEnvVars from "../environment";
import { addImg, predict } from "../api/Backend";
const { CLOUDVISIONAPIKEY } = getEnvVars();
import "react-native-get-random-values";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { GoBack } from "../components/goBack";
import { showMessage } from "react-native-flash-message";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const CameraPreview = ({ photo }: any) => {
  return (
    <View
      style={{
        backgroundColor: "transparent",
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1,
        }}
      />
    </View>
  );
};

let flipPosition: any =
  osName === "Android" ? (StatusBar.currentHeight as number) : 30;

export default function CameraScreen({ navigation, route }: any) {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [zoom, setZoom] = useState(0);
  const [, setIsLoading] = useContext(ImageContext).isLoading;
  const [, setUri] = useContext(ImageContext).uri;
  const [cameraImage, setCameraImage] = useState("") as any;
  const [, setMapPic] = useContext(ImageContext).mapPic;
  const [render, setRender] = useState(false);

  const isFocused = useIsFocused();

  const { purpose } = route.params;

  /**
   * @param data object containing the image anaysis from google vision api,
   * including the bounding boxes and name of the objects inside the picture
   *
   * @param {ImageResult} results the currently cropped image after taking the picture
   *
   * Purpose:
   *
   * adds the peice of data to localstorage and to firestore by uuid
   */
  const save = async (data: any, results: ImageResult) => {
    let items: any = [];
    const uniqueID = uuidv4();
    await AsyncStorage.getItem("multi").then((res) => {
      items = JSON.parse(res as string);

      items.unshift({
        key: uniqueID,
        image: results,
        multi: data,
      });
    });

    await AsyncStorage.setItem("multi", JSON.stringify(items));
    await addImg(uniqueID, data, results);
  };

  const handleEvent = (e: any) => {
    let newZoom =
      e.nativeEvent.velocity > 0
        ? zoom +
          e.nativeEvent.scale *
            e.nativeEvent.velocity *
            (Platform.OS === "ios" ? 0.001 : 5)
        : zoom -
          e.nativeEvent.scale *
            Math.abs(e.nativeEvent.velocity) *
            (Platform.OS === "ios" ? 0.002 : 5);

    if (newZoom < 0) newZoom = 0;
    else if (newZoom > 0.5) newZoom = 0.5;

    setZoom(newZoom);
  };

  let camera: Camera;

  /**
   * Purpose:
   *
   * takes the picture, crops the image to fit bounding box, and analyzes the image using google vision api
   */
  const __takePicture = async () => {
    if (!camera) return;
    setIsLoading(true);
    const photo = await camera.takePictureAsync({ quality: 1, base64: true });
    setCameraImage(photo);

    const manipImage = await manipulateAsync(
      photo.uri,
      [
        {
          resize: {
            width: photo.width,
            height: photo.height,
          },
        },
        {
          crop: {
            originX: 0,
            originY: (photo.height - photo.width) / 2,
            width: photo.width,
            height: photo.width,
          },
        },
      ],
      {
        format: "jpeg" as SaveFormat,
        compress: 0.5,
        base64: true
      }
    );

    if (purpose == "update map picture") {
      setIsLoading(false);
      setMapPic(photo.base64);
      navigation.goBack();
    } 
    else {
      let formData = new FormData();
      let filename = manipImage.uri.split("/").pop();
      let match = /\.(\w+)$/.exec(filename as string);
      let type = match ? `image/${match[1]}` : `image`;
      let uri = manipImage.uri

      // @ts-ignore
      formData.append("files[]", { uri: uri, name: filename, type });

      const MLdata:any = await predict(formData)



      if ("payload" in MLdata.success) {
        save(MLdata.success.payload, manipImage);
        setIsLoading(false);
        setUri(manipImage.uri);
        navigation.navigate("Drawer");
      } else {
        setIsLoading(false);
        showMessage({
          message: `No Categorizations were Found`,
          type: "danger",
          floating: true,
          statusBarHeight: flipPosition,
        });
        setUri(manipImage.uri);
        navigation.navigate("Drawer");
      }
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        navigation.navigate("Drawer");
      } else {
        setRender(true);
      }
    })();
  }, []);

  return (
    <>
      {render && cameraImage !== "" ? (
        <CameraPreview photo={cameraImage} />
      ) : (
        <PinchGestureHandler onGestureEvent={handleEvent}>
          <View>
            {isFocused && (
              <Camera
                type={type}
                flashMode={flash}
                ratio={"16:9"}
                zoom={zoom}
                style={{ height: "100%" }}
                ref={(r) => {
                  camera = r as Camera;
                }}
              >
                <Grid style={styles.bottomToolbar}>
                  <Row>
                    <Col style={styles.alignCenter}>
                      <TouchableOpacity
                        onPress={() => {
                          setFlash(
                            flash === Camera.Constants.FlashMode.off
                              ? Camera.Constants.FlashMode.on
                              : Camera.Constants.FlashMode.off
                          );
                        }}
                      >
                        {flash === Camera.Constants.FlashMode.off ? (
                          <Ionicons name="flash-off" size={30} color="white" />
                        ) : (
                          <Ionicons name="flash" size={30} color="white" />
                        )}
                      </TouchableOpacity>
                    </Col>
                    <Col size={2} style={styles.alignCenter}>
                      <TouchableOpacity
                        onPress={() => {
                          __takePicture();
                        }}
                      >
                        <View style={[styles.captureBtn]} />
                      </TouchableOpacity>
                    </Col>
                    <Col style={styles.alignCenter}>
                      <TouchableOpacity
                        onPress={() => {
                          setType(
                            type === Camera.Constants.Type.back
                              ? Camera.Constants.Type.front
                              : Camera.Constants.Type.back
                          );
                        }}
                      >
                        <MaterialIcons
                          name="flip-camera-ios"
                          size={30}
                          color="white"
                        />
                      </TouchableOpacity>
                    </Col>
                  </Row>
                </Grid>
                <Svg width={windowWidth} height={windowHeight}>
                  <Rect
                    x={8}
                    rx={20}
                    y={(windowHeight - windowWidth) / 2}
                    width={windowWidth - 16}
                    height={windowWidth}
                    stroke="rgba(255, 255, 255, .4)"
                    strokeWidth="3"
                  />
                </Svg>
              </Camera>
            )}
          </View>
        </PinchGestureHandler>
      )}

      <GoBack />
    </>
  );
}

const styles = StyleSheet.create({
  alignCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomToolbar: {
    width: windowWidth,
    position: "absolute",
    height: 100,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  captureBtn: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 60,
    borderColor: "white",
    borderStyle: "solid",
    backgroundColor: "white",
  },
  captureBtnActive: {
    width: 80,
    height: 80,
  },
  captureBtnInternal: {
    width: 76,
    height: 76,
    borderWidth: 2,
    borderRadius: 76,
    backgroundColor: "red",
    borderColor: "transparent",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
