import { useState, useContext } from 'react';
import * as React from 'react'
import { Dimensions, Image, Platform, StatusBar, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import ImageContext from '../hooks/imageContext';
import categories from '../components/categories'


const windowWidth = Dimensions.get('window').width;
let flipPosition = Platform.OS === "android" ? StatusBar.currentHeight as number : 30

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [material, setMaterial] = useContext(ImageContext).material
  const [uri, setUri] = useContext(ImageContext).uri
  const [width, setWidth] = useContext(ImageContext).width
  const [height, setHeight] = useContext(ImageContext).height

  let index = -1
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].name === material) {
      index = i
    }
  }

  return (<>
    {material != "0" ? <><Text style={styles.title}>{material} {index != -1 ? <Image source={categories[index].icon} style={styles.category} />: <></>}</Text></> : <></>}

    {uri === "" ? (<>
      
      <View style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 25, lineHeight: 40 }}>No Picture Taken</Text>
        <Image source={require("../assets/images/empty.png")} />
        <Text style={{ fontSize: 20 }}>Take a picture and see</Text>
        <Text style={{ fontSize: 20 }}>its recyclability here</Text>

      </View>
    </>) : (
      <Image source={{ uri: uri }} style={{ height: height, width: '100%', top: 90 }} />
    )}

  </>);
}

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    top: flipPosition + 20,
    left: 15,
    zIndex: 100
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  category: {
    width: 40, 
    height: 40, 
    backgroundColor: 'white', 
    borderRadius: 10
  }
});
