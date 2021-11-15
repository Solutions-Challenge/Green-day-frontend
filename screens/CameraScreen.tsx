import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { Camera } from 'expo-camera';
import { osName } from 'expo-device';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import ImageContext from '../hooks/imageContext';

let flipPosition: any = osName === "Android" ? StatusBar.currentHeight : 30

export default function CameraScreen() {
  const [hasPermission, setHasPermission]: any = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  
  const [height, setHeight] = useContext(ImageContext).height
  const [uri, setUri] = useContext(ImageContext).uri
  const [width, setWidth] = useContext(ImageContext).width

  let camera: Camera
  const __takePicture = async () => {
    if (!camera) return
    const photo = await camera.takePictureAsync()
    setHeight(photo.height)
    setUri(photo.uri)
    setWidth(photo.width)
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View>
      <Camera
        type={type}
        flashMode={flash}
        style={{ height: '100%' }}
        ref={(r) => {
          camera = r as Camera
        }}
      >
        <View style={{ top: flipPosition + 20, left: 20 }}>
          <TouchableOpacity
            style={{ position: 'absolute' }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <MaterialIcons name="flip-camera-ios" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ position: 'absolute', top: 50 }}
            onPress={() => {
              setFlash(
                flash === Camera.Constants.FlashMode.off
                  ? Camera.Constants.FlashMode.on
                  : Camera.Constants.FlashMode.off
              );
            }}>
            <Entypo name="flash" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ position: 'absolute', top: 100 }}
            onPress={() => {
              __takePicture();
            }}>
            <View style={{ backgroundColor: 'white', width: 35, height: 35, borderRadius: 50 }} />

          </TouchableOpacity>

        </View>
      </Camera>
    </View>
  );
}
