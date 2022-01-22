import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import ImageContext from './hooks/imageContext';
import Loading from './components/Loading';
import { SafeAreaView } from "react-native-safe-area-context"
console.disableYellowBox = true;


const Pic = {
  material: 0,
  uri: '',
  width: 0,
  error: "",
  hideTabBar: false,
  isLoading: false,
}



export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [material, setMaterial] = useState(Pic.material)
  const [uri, setUri] = useState(Pic.uri)
  const [hideTabBar, setHideTabBar] = useState(Pic.hideTabBar)
  const [width, setWidth] = useState(Pic.width)
  const [error, setError] = useState(Pic.error)
  const [isLoading, setIsLoading] = useState(Pic.isLoading)

  const store = {
    error: [error, setError],
    width: [width, setWidth],
    uri: [uri, setUri],
    material: [material, setMaterial],
    isLoading: [isLoading, setIsLoading],
    hideTabBar: [hideTabBar, setHideTabBar]
  }

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ImageContext.Provider value={store}>
        <SafeAreaProvider>
          <Loading />
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </ImageContext.Provider>
    );
  }
}