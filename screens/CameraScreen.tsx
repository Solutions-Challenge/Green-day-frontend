import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { Camera } from 'expo-camera';
import { osName } from 'expo-device';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import ImageContext from '../hooks/imageContext';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const aspectRatio = 200
const originX = Math.round(windowWidth / 2 - aspectRatio / 2)
const originY = Math.round(windowHeight / 2 - aspectRatio / 2)

let flipPosition: any = osName === "Android" ? StatusBar.currentHeight : 30

export default function CameraScreen() {
  const [hasPermission, setHasPermission]: any = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  
  const [h, setH] = useContext(ImageContext).height
  const [uri, setUri] = useContext(ImageContext).uri
  const [w, setW] = useContext(ImageContext).width

  let camera: Camera
  const __takePicture = async () => {
    if (!camera) return
    const photo = await camera.takePictureAsync()


    const manipImage = await manipulateAsync(
      photo.uri,
      [
        {crop: {height: aspectRatio, width: aspectRatio, originX: originX, originY: originY}}
      ]
    )

    setUri(manipImage.uri)
    setH(manipImage.height)
    setW(manipImage.width)
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
        <View style={{ backgroundColor: 'white', width: 35, height: 35, borderRadius: 50, position: 'absolute', top: originY, left: originX }} />
        <View style={{ backgroundColor: 'white', width: 35, height: 35, borderRadius: 50, position: 'absolute', top: originY + aspectRatio, left: originX }} />
        <View style={{ backgroundColor: 'white', width: 35, height: 35, borderRadius: 50, position: 'absolute', top: originY, left: originX + aspectRatio }} />
        <View style={{ backgroundColor: 'white', width: 35, height: 35, borderRadius: 50, position: 'absolute', top: originY + aspectRatio, left: originX + aspectRatio }} />
        

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
