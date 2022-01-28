import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { osName } from 'expo-device';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import ImageContext from '../hooks/imageContext';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { PinchGestureHandler } from 'react-native-gesture-handler';
import Svg, { Rect } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEnvVars from '../environment';
const { CLOUDVISIONAPIKEY } = getEnvVars();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function CameraScreen({ navigation, route }: any) {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [zoom, setZoom] = useState(0)
  const [, setIsLoading] = useContext(ImageContext).isLoading
  const [uri, setUri] = useContext(ImageContext).uri
  const [, setProfileUri] = useContext(ImageContext).profileUri


  const isFocused = useIsFocused();

  const { purpose, screen } = route.params

  const save = async (data: any, uri: string, windowWidth: number) => {

    let items: any = []

    await AsyncStorage.getItem("multi")
      .then((res) => {
        items = JSON.parse(res as string)

        if (items.length > 10) {
          items.pop()
        }

        items.unshift({
          key: uuid(),
          width: windowWidth,
          uri: uri,
          multi: data,
        })
      })

    await AsyncStorage.setItem("multi", JSON.stringify(items))
  }

  const handleEvent = (e: any) => {
    let newZoom =
      e.nativeEvent.velocity > 0
        ? zoom + e.nativeEvent.scale * e.nativeEvent.velocity * (Platform.OS === "ios" ? 0.001 : 5)
        : zoom - e.nativeEvent.scale * Math.abs(e.nativeEvent.velocity) * (Platform.OS === "ios" ? 0.002 : 5);

    if (newZoom < 0) newZoom = 0;
    else if (newZoom > 0.5) newZoom = 0.5;

    setZoom(newZoom);
  }

  let camera: Camera
  const __takePicture = async () => {
    if (!camera) return
    setIsLoading(true)
    const photo = await camera.takePictureAsync({ quality: 1 })

    const manipImage = await manipulateAsync(
      photo.uri,
      [{
        resize: {
          width: photo.width,
          height: photo.height
        }
      },
      {
        crop: {
          originX: 0,
          originY: (photo.height - photo.width) / 2,
          width: photo.width,
          height: photo.width
        }
      }
      ],
      {
        format: 'jpeg' as SaveFormat,
        compress: 1,
        base64: true
      }
    )

    if (purpose !== "") {
      setIsLoading(false)
      setProfileUri(manipImage.uri)
      navigation.goBack()
    }

    else {
      const body = JSON.stringify({
        requests: [
          {
            image: {
              content: manipImage.base64
            },
            features: [
              {
                type: "OBJECT_LOCALIZATION",
                maxResults: 10
              }
            ]
          }
        ]
      })

      const visionRequest = await fetch(`https://vision.googleapis.com/v1p3beta1/images:annotate?key=${CLOUDVISIONAPIKEY}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: body
      })

      const visionData = await visionRequest.json()

      if ("localizedObjectAnnotations" in visionData.responses[0]) {
        let object
        let formData = new FormData();
        for (let i = 0; i < visionData.responses[0].localizedObjectAnnotations.length; i++) {
          object = visionData.responses[0].localizedObjectAnnotations[i]

          const croppedImage = await manipulateAsync(
            manipImage.uri,
            [{
              resize: {
                width: manipImage.width,
                height: manipImage.height
              }
            },
            {
              crop: {
                originX: manipImage.width * object.boundingPoly.normalizedVertices[0].x || 0,
                originY: manipImage.height * object.boundingPoly.normalizedVertices[0].y || 0,
                width: (manipImage.width * object.boundingPoly.normalizedVertices[2].x || 0) - (manipImage.width * object.boundingPoly.normalizedVertices[0].x || 0),
                height: (manipImage.height * object.boundingPoly.normalizedVertices[2].y || 0) - (manipImage.height * object.boundingPoly.normalizedVertices[0].y || 0)
              }
            }
            ],
            {
              format: 'jpeg' as SaveFormat,
              compress: 1,
            }
          )
          object.croppedImage = croppedImage.uri
        }

        save(visionData.responses[0].localizedObjectAnnotations, manipImage.uri, windowWidth)
        setIsLoading(false)
        setUri(manipImage.uri)
        navigation.navigate('Drawer')
      }
      else {
        console.log('empty')
        setIsLoading(false)
        setUri(manipImage.uri)
        navigation.navigate('Drawer')
      }
    }
  }

  const goBack = () => {
    navigation.goBack()
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        navigation.navigate("Drawer")
      }
    })();
  }, []);

  return (<>
    <PinchGestureHandler
      onGestureEvent={handleEvent}
    >
      <View>
        {isFocused && <Camera
          type={type}
          flashMode={flash}
          ratio={"16:9"}
          zoom={zoom}
          style={{ height: '100%' }}
          ref={(r) => {
            camera = r as Camera
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
                  }}>
                  {
                    flash === Camera.Constants.FlashMode.off ? (
                      <Ionicons name="flash-off" size={30} color="white" />
                    ) : (
                      <Ionicons name="flash" size={30} color="white" />
                    )
                  }
                </TouchableOpacity>
              </Col>
              <Col size={2} style={styles.alignCenter}>
                <TouchableOpacity
                  onPress={() => {
                    __takePicture();
                  }}>
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
                  }}>
                  <MaterialIcons name="flip-camera-ios" size={30} color="white" />
                </TouchableOpacity>
              </Col>
            </Row>
          </Grid>
          <Svg
            width={windowWidth}
            height={windowHeight}
          >
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

        </Camera>}
      </View>
    </PinchGestureHandler>

    <View style={{ position: 'absolute', top: flipPosition + 30, left: 10, backgroundColor: 'black', borderRadius: 60 }}>
      <TouchableOpacity onPress={goBack}>
        <Ionicons name="ios-arrow-back-sharp" size={30} color="white" />
      </TouchableOpacity>
    </View>

  </>);
}

const styles = StyleSheet.create({
  alignCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomToolbar: {
    width: windowWidth,
    position: 'absolute',
    height: 100,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  captureBtn: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 60,
    borderColor: 'white',
    borderStyle: 'solid',
    backgroundColor: 'white',
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
    justifyContent: 'center',
    alignItems: 'center'
  }
})
