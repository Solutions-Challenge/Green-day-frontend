import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { osName } from 'expo-device';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import ImageContext from '../hooks/imageContext';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { PinchGestureHandler } from 'react-native-gesture-handler';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30

export default function CameraScreen({ navigation }: any) {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [zoom, setZoom] = useState(0)
  const [isLoading, setIsLoading] = useContext(ImageContext).isLoading
  const [uri, setUri] = useContext(ImageContext).uri

  const isFocused = useIsFocused();

  const save = async (material: string, uri: string, width: number) => {

    let items:any = []

    await AsyncStorage.getItem("ImageClassify")
    .then((res)=>{
      items = JSON.parse(res as string)

      if (items.length > 10) {
        items.pop()
      }

      items.unshift({
        key: 0,
        material: material,
        uri: uri,
        width: width
      })

      items.map((e:any, index:number)=>{
        e.key = index
      })

    })
    await AsyncStorage.setItem("ImageClassify", JSON.stringify(items))
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
    const photo = await camera.takePictureAsync()

    setIsLoading(true)

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
      }
    )

    let localUri = manipImage.uri;
    let filename = localUri.split('/').pop();

    let match = /\.(\w+)$/.exec(filename as string);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();

    // @ts-ignore
    formData.append('file', { uri: localUri, name: filename, type });

    const res = await fetch('http://100.64.56.31:5000/predict', {
      method: 'POST',
      body: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })

    const data = await res.json()

    setIsLoading(false)

    save(data.material, manipImage.uri, windowWidth)
    setUri(manipImage.uri)

    navigation.navigate('Home')
  }

  const goBack = () => {
    navigation.navigate('Home')
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        navigation.navigate('Home')
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
          <View style={{ position: 'absolute', top: flipPosition + 30, left: 10, backgroundColor: 'black', borderRadius: 60 }}>
            <TouchableOpacity onPress={goBack}>
              <Ionicons name="ios-arrow-back-sharp" size={30} color="white" />
            </TouchableOpacity>
          </View>

          <Svg
            width={windowWidth}
            height={windowHeight}
          >
            <Rect x={0} y={(windowHeight - windowWidth) / 2} width={windowWidth} height={windowWidth} stroke="white" strokeWidth="5" />
          </Svg>

        </Camera>}
      </View>
    </PinchGestureHandler>

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
