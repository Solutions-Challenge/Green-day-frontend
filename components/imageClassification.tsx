import ImageContext from '../hooks/imageContext';
import { useState, useContext } from 'react';
import * as React from 'react'
import { Text, View } from '../components/Themed';
import { Dimensions, Image, Platform, StatusBar, StyleSheet, Button } from 'react-native';
import categories from '../components/categories';


const imageClassification = ({material, uri, width}:any) => {

    // allows the home page to handle categories without icons
    let index = 0
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].name === material) {
        index = i
      }
    }

    return (
        <View style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        <View style={styles.containerTitle}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', paddingRight: 10 }}>{material}</Text>
          <Image source={categories[index].icon} style={styles.category} />
        </View>
        <Image source={{ uri: uri }} style={{ height: width / 2, width: width / 2, borderRadius: 3 }} />
      </View>
    )
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

export default imageClassification