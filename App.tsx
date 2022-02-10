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
  fullName: "",
  isLoading: false,
  uid: "",
  bs: null,
  firstPoint: 0,
  secondPoint: 0,
  visible: true,
  ifRenderMap: false,
  addingMarker: {} as any,
  itemData: {} as any,
  mapPic: "" as any
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
  const [fullName, setFullName] = useState(Pic.fullName)
  const [uid, setUid] = useState(Pic.uid)
  const [bs, setBs] = useState(Pic.bs)
  const [firstPoint, setFirstPoint] = useState(Pic.firstPoint)
  const [secondPoint, setSecondPoint] = useState(Pic.secondPoint)
  const [ifRenderMap, setIfRenderMap] = useState(Pic.ifRenderMap)
  const [addingMarker, setAddingMarker] = useState(Pic.addingMarker)
  const [itemData, setItemData] = useState(Pic.itemData)
  const [visible, setVisible] = useState(Pic.visible)
  const [mapPic, setMapPic] = useState(Pic.mapPic)


  const store = {
    error: [error, setError],
    width: [width, setWidth],
    uri: [uri, setUri],
    material: [material, setMaterial],
    isLoading: [isLoading, setIsLoading],
    profileUri: [profileUri, setProfileUri],
    fullName: [fullName, setFullName],
    uid: [uid, setUid],
    bs: [bs, setBs],
    firstPoint: [firstPoint, setFirstPoint],
    secondPoint: [secondPoint, setSecondPoint],
    ifRenderMap: [ifRenderMap, setIfRenderMap],
    addingMarker: [addingMarker, setAddingMarker],
    itemData: [itemData, setItemData],
    visible: [visible, setVisible],
    mapPic: [mapPic, setMapPic]
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