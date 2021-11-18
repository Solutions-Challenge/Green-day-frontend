import * as React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { osName } from 'expo-device';
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location'
import { useEffect, useState } from 'react';
import useColorScheme from '../hooks/useColorScheme';
import data from '../mapStyle.json'

let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30

export default function App({ navigation }: any) {
  const colorScheme = useColorScheme();
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)

  const goBack = () => {
    navigation.navigate('Home')
  }

  useEffect(() => {
    (async () => {
      let { status } = await requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        navigation.navigate('Home')
      }

      let location = await getCurrentPositionAsync({})
      setLatitude(location.coords.latitude)
      setLongitude(location.coords.longitude)
    })();
  }, []);

  return (<>

    <MapView style={StyleSheet.absoluteFill}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      customMapStyle={colorScheme === 'dark' ? data: []}
      region={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }}
    >
    </MapView>

    <View style={{ position: 'absolute', top: flipPosition + 30, left: 10, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 60 }}>
      <TouchableOpacity onPress={goBack}>
        <Ionicons name="ios-arrow-back-sharp" size={30} color="white" />
      </TouchableOpacity>
    </View>
  </>);
}
