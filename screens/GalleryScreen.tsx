import { useState, useContext, useEffect } from 'react';
import * as React from 'react'
import { Animated, Button, Dimensions, Image, Platform, StatusBar, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import ImageContext from '../hooks/imageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageClassification from '../components/imageClassification'

export default function TabOneScreen() {
  const [data, setData] = useState([{material: 'TEST', width: 1, uri: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fimages%2Fnature%2Fspace&psig=AOvVaw0i3nacdsYAYZCEvN3Sm9Zo&ust=1638685496890000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCMierqnByfQCFQAAAAAdAAAAABAJ'}])

  const load = async() => {
    try {
      let ImageClassify = await AsyncStorage.getItem("ImageClassify")
      if (ImageClassify != null) {
        let d = JSON.parse(ImageClassify)
        d.filter((e:any)=>{
          return e.hasOwnProperty('material')
        })

        let ans = []
        for (let i = 0 ; i < d.length; i++) {
          if ('material' in d[i]) {
            ans.push(d[i])
          }
        }
        setData(ans.reverse())
      }
    }
    catch (err) {
      alert(err)
    }
  }

  useEffect(() => {
    (async () => {
      load()
    })();
  }, []);
 
  return (<>
    <Animated.ScrollView
       contentContainerStyle={{
        paddingVertical: 150
      }}
    >
        
      {data.map((e, index)=>{
        return (
          <ImageClassification key={index} material={e.material} uri={e.uri} width={e.width} />
        )
      })}
    </Animated.ScrollView>
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
