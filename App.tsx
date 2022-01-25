import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import ImageContext from './hooks/imageContext';
import Loading from './components/Loading';
console.disableYellowBox = true;


const Pic = {
  material: 0,
  uri: '',
  width: 0,
  error: "",
  profileUri: "",
  isLoading: false,
  showPicButton: true
}



export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [material, setMaterial] = useState(Pic.material)
  const [uri, setUri] = useState(Pic.uri)
  const [profileUri, setProfileUri] = useState(Pic.profileUri)
  const [width, setWidth] = useState(Pic.width)
  const [error, setError] = useState(Pic.error)
  const [isLoading, setIsLoading] = useState(Pic.isLoading)

  const store = {
    error: [error, setError],
    width: [width, setWidth],
    uri: [uri, setUri],
    material: [material, setMaterial],
    isLoading: [isLoading, setIsLoading],
    profileUri: [profileUri, setProfileUri],
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