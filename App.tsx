import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import ImageContext from './hooks/imageContext';


const Pic = {
  material: 0,
  uri: '',
  width: 0,
  height: 0
}



export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [material, setMaterial] = useState(Pic.material)
  const [uri, setUri] = useState(Pic.uri)
  const [width, setWidth] = useState(Pic.width)
  const [height, setHeight] = useState(Pic.height)

  const store = {
    height: [height, setHeight],
    width: [width, setWidth],
    uri: [uri, setUri],
    material: [material, setMaterial]

  }

  if (!isLoadingComplete) {
    return null;
  } else {
    return ( 
      <ImageContext.Provider value={store}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </ImageContext.Provider>
    );
  }
}