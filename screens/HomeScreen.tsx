import { useState, useContext, useEffect } from 'react';
import * as React from 'react'
import { Button, Dimensions, Image, Platform, StatusBar, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import ImageContext from '../hooks/imageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageClassification from '../components/imageClassification'
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';


const windowWidth = Dimensions.get('window').width;
let flipPosition = Platform.OS === "android" ? StatusBar.currentHeight as number : 30

export default function TabOneScreen() {
  const [material, setMaterial] = useContext(ImageContext).material
  const [uri, setUri] = useContext(ImageContext).uri
  const [width, setWidth] = useContext(ImageContext).width
 
  return (<>
    {uri === "" ? (<>

      <View style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 25, lineHeight: 40 }}>No Picture Taken</Text>
        <Image source={require("../assets/images/empty.png")} />
        <Text style={{ fontSize: 20 }}>Take a picture and see</Text>
        <Text style={{ fontSize: 20 }}>its recyclability here</Text>
      </View>
    </>) : (
      <ImageClassification material={material} uri={uri} width={width} />
    )}
  </>);
}

const styles = StyleSheet.create({
  containerTitle: {
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  category: {
    width: 45,
    height: 45,
    backgroundColor: 'white',
    borderRadius: 3
  }
});
