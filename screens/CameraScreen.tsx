import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TouchableWithoutFeedback } from 'react-native';
import { Camera } from 'expo-camera';
import { osName } from 'expo-device';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import ImageContext from '../hooks/imageContext';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Col, Row, Grid } from "react-native-easy-grid";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30

export default function CameraScreen({ navigation }: any) {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);

  const [material, setMaterial] = useContext(ImageContext).material
  const [uri, setUri] = useContext(ImageContext).uri
  const [w, setW] = useContext(ImageContext).width
  const [h, setH] = useContext(ImageContext).height

  const isFocused = useIsFocused();


  let camera: Camera
  const __takePicture = async () => {
    if (!camera) return
    const photo = await camera.takePictureAsync()

    const manipImage = await manipulateAsync(
      photo.uri,
      [{ resize: { width: 200 } }]
    )

    let localUri = manipImage.uri;
    let filename = localUri.split('/').pop();

    let match = /\.(\w+)$/.exec(filename as string);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();

    // @ts-ignore
    formData.append('file', { uri: localUri, name: filename, type });

    const res = await fetch('http://100.64.57.231:5000/predict', {
      method: 'POST',
      body: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })

    const data = await res.json()

    setMaterial(data.material)
    setUri(manipImage.uri)
    setW(manipImage.width)
    setH(manipImage.height)

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

  return (
    <View>
      {isFocused && <Camera
        type={type}
        flashMode={flash}
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
        <View style={{ position: 'absolute', top: flipPosition + 30, left: 10 }}>
          <TouchableOpacity onPress={goBack}>
            <Ionicons name="ios-arrow-back-sharp" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>}
    </View>
  );
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
})
