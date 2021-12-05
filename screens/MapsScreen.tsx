import React, { useContext } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar, TextInput, ScrollView, Animated, Button, Linking } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { osName } from 'expo-device';
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location'
import { useEffect, useRef, useState } from 'react';
import useColorScheme from '../hooks/useColorScheme';
import data from '../mapStyle.json';
import { Platform } from 'expo-modules-core';
import { Image } from 'react-native'
import StarRating from '../components/StarRating';
import fetchData from '../api/googleMaps'
import categories from '../components/categories'
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageContext from '../hooks/imageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


let flipPosition = Platform.OS === "android" ? StatusBar.currentHeight as number : 30
const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 150;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
const latitudeDelta = 0.0922
const longitudeDelta = 0.121

function getDistanceFromLatLonInKm(lat1:number,lon1:number,lat2:number,lon2:number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg:number) {
  return deg * (Math.PI/180)
}

export default function App({ navigation }: any) {
  const colorScheme = useColorScheme();
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const _map = useRef(null as any)
  const _scrollView = useRef(null as any)
  const [isLoading, setIsLoading] = useContext(ImageContext).isLoading

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

  const findLink = (href:string) => {
    let temp = href.split('"')
    href = temp[1]

    return href
  }

  const canMap = () => {
    return JSON.stringify(mapData) !== '{}'
  }

  useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      if (canMap()) {
        
        let index = Math.floor(value / CARD_WIDTH + 0.3)
        
        if (index >= mapData.results.length) {
          index = mapData.results.length - 1;
        }
        if (index <= 0) {
          index = 0;
        }
  
        // @ts-ignore
        clearTimeout(regionTimeout);
        const regionTimeout = setTimeout(() => {
          if (mapIndex !== index && canMap()) {
            mapIndex = index;
            
            let lat = mapData.results[index].geometry.location.lat
            let lng = mapData.results[index].geometry.location.lng
  
            _map.current.animateToRegion(
              {
                latitude: lat,
                longitude: lng,
                latitudeDelta: latitudeDelta,
                longitudeDelta: longitudeDelta
              },
              300
            );
          }
        }, 10);
      }
    });
  });



  const goBack = () => {
    navigation.navigate('Home')
  }

  const [mapData, setmapData] = useState({} as any)

  useEffect(() => {
    (async () => {
      let { status } = await requestForegroundPermissionsAsync();
      setIsLoading(true)

      if (status !== 'granted') {
        navigation.navigate('Home')
      }

      let location = await getCurrentPositionAsync({})
      setLatitude(location.coords.latitude)
      setLongitude(location.coords.longitude)
      setIsLoading(false)
    })();
  }, []);

  useEffect(() => { 
    (async () => {
      
      if (latitude !== 0 && longitude !== 0) {
        let mapCache = await AsyncStorage.getItem("MapCache")
        if (mapCache === null) {
          let item = await fetchData(latitude, longitude)
          await AsyncStorage.setItem("MapCache", JSON.stringify(item))
          await AsyncStorage.setItem("CurrentLocation", JSON.stringify({latitude: latitude, longitude: longitude}))
        }
        
        let check = false
        await AsyncStorage.getItem("CurrentLocation")
        .then((res)=>{
          let item = JSON.parse(res as string)
          let distance = getDistanceFromLatLonInKm(latitude, longitude, item.latitude, item.longitude)
          if (distance > 16.0934) {
            check = true
          }
        })

        if (check) {
          let item = await fetchData(latitude, longitude)
          await AsyncStorage.setItem("MapCache", JSON.stringify(item))
          await AsyncStorage.setItem("CurrentLocation", JSON.stringify({latitude: latitude, longitude: longitude}))
        }
        
        await AsyncStorage.getItem("MapCache")
        .then((res)=>{
          let item = JSON.parse(res as string)
          setmapData(item)
        })
        
        
      } 
    })();
  }, [longitude])

  return (<SafeAreaView style={{flex: 1}}>
    <MapView style={Platform.OS === "ios" ? StyleSheet.absoluteFill: {flex: 1}}
      ref={_map}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      customMapStyle={colorScheme === 'dark' ? data : []}
      region={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta
      }}
    >
      { canMap() ? mapData.results.map((e:any, index:any) => {
        return (
          <Marker
            key={index}
            coordinate={{
              latitude: e.geometry.location.lat,
              longitude: e.geometry.location.lng
            }}
            onPress={(mapEventData) => {
              // @ts-ignore
              const markerId = mapEventData._targetInst.return.key;
              let x = markerId * CARD_WIDTH + markerId * 20
              if (Platform.OS === 'ios') {
                x = x - SPACING_FOR_CARD_INSET;
              }
              _scrollView.current.scrollTo({ x: x, y: 0, animated: true })
            }}
          >
            <Animated.View style={[
              styles.marker,
              {
                height: '100%',
                width: '100%',
              }
            ]}>
              <FontAwesome name="map-marker" size={30} color={colorScheme === "dark" ? "white" : "red"} />
            </Animated.View>
          </Marker>
        )
        }):<></>}
    </MapView>

    <View style={styles.searchBox}>
      <TextInput
        placeholder="Search Here"
        placeholderTextColor="#000"
        autoCapitalize="none"
        style={{ flex: 1, padding: 0 }}
      />
      <Ionicons name="ios-search" size={20} />
    </View>

    <ScrollView
      horizontal
      scrollEventThrottle={1}
      showsHorizontalScrollIndicator={false}
      style={styles.chipsScrollView}
      contentContainerStyle={{
        paddingRight: 20
      }}
    >
      {categories.map((e, index) => {
        return (<TouchableOpacity key={index} style={styles.chipsItem}>
          <Image source={e.icon} style={{width: 20, height:20, marginRight: 5}} />
          <Text>{e.name}</Text>
        </TouchableOpacity>)
      })}

    </ScrollView>

    <Animated.ScrollView
      ref={_scrollView}
      horizontal
      disableScrollViewPanResponder={true}
      scrollEventThrottle={1}
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
      pagingEnabled
      snapToInterval={CARD_WIDTH + 20}
      snapToAlignment="center"
      decelerationRate="fast"
      contentInset={{
        top: 0,
        left: SPACING_FOR_CARD_INSET,
        bottom: 0,
        right: SPACING_FOR_CARD_INSET
      }}
      contentContainerStyle={{
        paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0
      }}
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                x: mapAnimation
              }
            }
          }
        ],
        { useNativeDriver: true }
      )}
    >
      {canMap() ? mapData.results.map((e:any, index:any) => {
        return (<View style={styles.card} key={index}>
          <View style={styles.textContent}>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={{uri: e.icon}}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View>
                  <Text numberOfLines={1} style={styles.cardtitle}>{e.name}</Text>
                  <StarRating ratings={Math.round(e.rating)} reviews={e.user_ratings_total} />
                </View>
              </View>
              <Text numberOfLines={1} style={styles.cardDescription}>{e.description}</Text>
              {"photos" in e ? <Button title="Details" onPress={()=>{ Linking.openURL(findLink(e.photos[0].html_attributions[0]))}}>
              </Button>: <></>}
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                onPress={() => {Linking.openURL(`https://maps.${Platform.OS === "android" ? "google" : "apple"}.com/?q=${e.vicinity}`)}}
                style={styles.signIn}
              >
                <Text style={styles.textSign}>{e.vicinity}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>)

      }):<></>}
    </Animated.ScrollView>

    <View style={{ position: 'absolute', top: Platform.OS === "ios" ? 40 : flipPosition + 12, left: 12, backgroundColor: "black", borderRadius: 60 }}>
      <TouchableOpacity onPress={goBack}>
        <Ionicons name="ios-arrow-back-sharp" size={35} color="white" />
      </TouchableOpacity>
    </View>

  </SafeAreaView>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? 40 : flipPosition + 11,
    flexDirection: "row",
    backgroundColor: '#fff',
    width: '70%',
    alignSelf: 'center',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  chipsItem: {
    flexDirection: "row",
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    height: 35,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  chipsScrollView: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : flipPosition + 80,
    paddingHorizontal: 10,
    width: '100%',
  },
  chipsIcon: {
    marginRight: 5,
  },
  scrollView: {
    position: "absolute",
    bottom: Platform.OS === 'android' ? 20: 40,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: Platform.OS === "android" ? 40: 20,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    width: 32,
    height: 32,
    marginRight: 10
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  marker: {
    width: 30,
    height: 30,
  },
  button: {
    alignItems: 'center',
    marginTop: 5
  },
  signIn: {
    width: '100%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  },
  textSign: {
    borderRadius: 3,
    borderColor: '#aaa',
    borderWidth: 1,
    color: '#444',
    fontSize: 14,
    marginBottom: 0,
    minWidth: 64,
    paddingHorizontal: 3,
    paddingVertical: 12
  }
});
