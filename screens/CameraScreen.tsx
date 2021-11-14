import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { Camera } from 'expo-camera';
import { osName } from 'expo-device';
import { MaterialIcons, Entypo } from '@expo/vector-icons';

let flipPosition:any = osName === "Android" ? StatusBar.currentHeight: 30

export default function CameraScreen() {
  const [hasPermission, setHasPermission]:any = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  console.log(flash)
  console.log(type)

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
      <Camera type={type} flashMode={flash} style={{height: '100%'}}>
        <View>
          <TouchableOpacity
            style={{position: 'absolute', top: flipPosition + 20, left: 20}}
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
            style={{position: 'absolute', top: flipPosition + 60, left: 20}}
            onPress={() => {
              setFlash(
                flash === Camera.Constants.FlashMode.off
                  ? Camera.Constants.FlashMode.on
                  : Camera.Constants.FlashMode.off
              );
            }}>
            <Entypo name="flash" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}
