import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import ImageContext from './hooks/imageContext';

const Pic = {
  height: 0,
  uri: '',
  width: 0
}



export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [height, setHeight] = useState(Pic.height)
  const [uri, setUri] = useState(Pic.uri)
  const [width, setWidth] = useState(Pic.width)

  const store = {
    height: [height, setHeight],
    uri: [uri, setUri],
    width: [width, setWidth]
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