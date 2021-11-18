import * as React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { osName } from 'expo-device';
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location'
import { useEffect, useState } from 'react';

let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30

export default function App({ navigation }: any) {

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
      region={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }}
    >
    </MapView>

    <View style={{ position: 'absolute', top: flipPosition + 30, left: 10 }}>
      <TouchableOpacity onPress={goBack}>
        <Ionicons name="ios-arrow-back-sharp" size={30} color="white" />
      </TouchableOpacity>
    </View>
  </>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

function componentWillMount() {
  throw new Error('Function not implemented.');
}
