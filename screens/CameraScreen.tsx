import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { Camera } from 'expo-camera';
import { osName } from 'expo-device';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import ImageContext from '../hooks/imageContext';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

let flipPosition: any = osName === "Android" ? StatusBar.currentHeight : 30

export default function CameraScreen() {
  const [hasPermission, setHasPermission]: any = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  
  const [material, setMaterial] = useContext(ImageContext).material
  const [uri, setUri] = useContext(ImageContext).uri
  const [w, setW] = useContext(ImageContext).width
  const [h, setH] = useContext(ImageContext).height

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const isFocused = useIsFocused();


  let camera: Camera
  const __takePicture = async () => {
    if (!camera) return
    const photo = await camera.takePictureAsync()

    const manipImage = await manipulateAsync(
      photo.uri,
      [{ resize: { width: 300 } }]
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
      {isFocused &&  <Camera
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
      </Camera>}
    </View>
  );
}
