import { useState, useContext } from 'react';
import * as React from 'react'
import { Dimensions, Image, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import ImageContext from '../hooks/imageContext';

const windowWidth = Dimensions.get('window').width;

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [height, setHeight] = useContext(ImageContext).height
  const [uri, setUri] = useContext(ImageContext).uri
  const [width, setWidth] = useContext(ImageContext).width

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{height}</Text>
      <Text style={styles.title}>{width}</Text>
      { uri === "" ? (
        <></>
      ): (
        <Image source={{uri: uri}} style={{height: height, width: width}} />
      )}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
