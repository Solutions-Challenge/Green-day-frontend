import React, { useCallback, useContext } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar, TextInput, ScrollView, Animated, Button, Linking, ImageBackground, FlatList } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
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
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 100;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
const latitudeDelta = 0.0922
const longitudeDelta = 0.121

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}

export default function App({ navigation }: any) {
  const colorScheme = useColorScheme();
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const _map = useRef(null as any)
  const _scrollView = useRef(null as any)
  const [isLoading, setIsLoading] = useContext(ImageContext).isLoading
  const [mapIndex, setMapIndex] = useState(0)
  const isFocused = useIsFocused();

  const [catIndex, setCatIndex] = useState(0)
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 100 })
  let onViewableItemsChanged = useRef(({ viewableItems, changed }: any) => {
    setMapIndex(changed[0].key);
  })

  useEffect(()=>{
    if (canMap()) {
      _map.current.animateToRegion({
        latitude: mapData.results[mapIndex].geometry.location.lat,
        longitude: mapData.results[mapIndex].geometry.location.lng,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta
      })
    }
  }, [mapIndex])

  const [mapData, setmapData] = useState({} as any)

  const findLink = (href: string) => {
    let temp = href.split('"')
    href = temp[1]

    return href
  }

  const canMap = () => {
    return JSON.stringify(mapData) !== '{}'
  }

  useEffect(() => {
    (async () => {
      let { status } = await requestForegroundPermissionsAsync();
      setIsLoading(true)


      // Await user to grant location access
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

        // Caches data of original location
        let mapCache = await AsyncStorage.getItem("MapCache")
        if (mapCache === null) {
          let item = await fetchData(latitude, longitude)
          await AsyncStorage.setItem("MapCache", JSON.stringify(item))
          await AsyncStorage.setItem("CurrentLocation", JSON.stringify({ latitude: latitude, longitude: longitude }))
        }


        // If the current location surpasses ~10 miles, rerender new search query for recycling centers
        let check = false
        await AsyncStorage.getItem("CurrentLocation")
          .then((res) => {
            let item = JSON.parse(res as string)
            let distance = getDistanceFromLatLonInKm(latitude, longitude, item.latitude, item.longitude)
            if (distance > 16.0934) {
              check = true
            }
          })

        if (check) {
          let item = await fetchData(latitude, longitude)
          await AsyncStorage.setItem("MapCache", JSON.stringify(item))
          await AsyncStorage.setItem("CurrentLocation", JSON.stringify({ latitude: latitude, longitude: longitude }))
        }

        await AsyncStorage.getItem("MapCache")
          .then((res) => {
            let item = JSON.parse(res as string)
            setmapData(item)
          })
      }
    })();
  }, [longitude])

  return (<>{isFocused && <SafeAreaView style={{ flex: 1 }}>
    <MapView style={Platform.OS === "ios" ? StyleSheet.absoluteFill : { flex: 1 }}
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
      {canMap() ? mapData.results.map((e: any, index: any) => {
        return (
          <Marker
            key={index}
            coordinate={{
              latitude: e.geometry.location.lat,
              longitude: e.geometry.location.lng
            }}
            onPress={() => {
              _scrollView.current.scrollToIndex({ index: "" + index, animated: true, viewPosition: 0.5 })
            }}
          >
            <FontAwesome name="map-marker" size={30} color={colorScheme === "dark" ? "white" : "red"} />
          </Marker>
        )
      }) : <></>}
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

    <FlatList
      horizontal
      scrollEventThrottle={1}
      showsHorizontalScrollIndicator={false}
      style={styles.chipsScrollView}
      contentContainerStyle={{
        paddingRight: 20
      }}
      data={categories}
      renderItem={({ item }: any) => {
        return (
          (item.key != 0 ? <TouchableOpacity
            key={item.key}
            onPress={() => {
              setCatIndex(item.key)
            }}
            style={[styles.chipsItem, { backgroundColor: item.key === catIndex ? "#ADD8E6" : "white" }]}>
            <Image source={item.icon} style={{ width: 20, height: 20, marginRight: 5 }} />
            <Text>{item.name}</Text>
          </TouchableOpacity> : <View key={item.key} />)
        )
      }}
    >
    </FlatList>
    <FlatList
      ref={_scrollView}
      initialScrollIndex={0}
      viewabilityConfig={viewConfigRef.current}
      onViewableItemsChanged={onViewableItemsChanged.current}
      horizontal
      pagingEnabled
      scrollEventThrottle={1}
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH + 20}
      snapToAlignment="center"
      decelerationRate={"fast"}
      style={styles.scrollView}
      contentInset={{
        top: 0,
        left: SPACING_FOR_CARD_INSET,
        bottom: 0,
        right: SPACING_FOR_CARD_INSET
      }}
      contentContainerStyle={{
        paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0
      }}
      data={mapData.results}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }: any) => {
        return (
          canMap() ? <View style={[styles.card, { backgroundColor: colorScheme === "dark" ? '#181818' : "white" }]}>
            <View style={styles.textContent}>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={{ uri: item.icon }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <View>
                    <Text numberOfLines={1} style={[styles.cardtitle, { color: colorScheme === "dark" ? "white" : "black" }]}>{item.name}</Text>
                    <StarRating ratings={Math.round(item.rating)} reviews={item.user_ratings_total} />
                  </View>
                </View>
                {"photos" in item ? <Button title="Details" onPress={() => { Linking.openURL(findLink(item.photos[0].html_attributions[0])) }}>
                </Button> : <></>}
              </View>
              <View style={styles.button}>
                <TouchableOpacity
                  onPress={() => { Linking.openURL(`https://maps.${Platform.OS === "android" ? "google" : "apple"}.com/?q=${item.vicinity}`) }}
                  style={styles.signIn}
                >
                  <Text style={[styles.textSign, { color: colorScheme === "dark" ? "white" : "black" }]}>{item.vicinity}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View> : <></>
        )
      }}
    >
    </FlatList>

    {/* <Animated.ScrollView
      ref={_scrollView}
      horizontal
      pagingEnabled
      scrollEventThrottle={1}
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH + 20}
      snapToAlignment="center"
      decelerationRate={"fast"}
      automaticallyAdjustContentInsets={true}
      style={styles.scrollView}
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
        { useNativeDriver: false }
      )}
    >
      {canMap() ? mapData.results.map((e: any, index: any) => {
        return (<View style={[styles.card, { backgroundColor: colorScheme === "dark" ? '#181818' : "white" }]} key={index}>
          <View style={styles.textContent}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={{ uri: e.icon }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View>
                  <Text numberOfLines={1} style={[styles.cardtitle, { color: colorScheme === "dark" ? "white" : "black" }]}>{e.name}</Text>
                  <StarRating ratings={Math.round(e.rating)} reviews={e.user_ratings_total} />
                </View>
              </View>
              {"photos" in e ? <Button title="Details" onPress={() => { Linking.openURL(findLink(e.photos[0].html_attributions[0])) }}>
              </Button> : <></>}
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                onPress={() => { Linking.openURL(`https://maps.${Platform.OS === "android" ? "google" : "apple"}.com/?q=${e.vicinity}`) }}
                style={styles.signIn}
              >
                <Text style={[styles.textSign, { color: colorScheme === "dark" ? "white" : "black" }]}>{e.vicinity}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>)

      }) : <></>}
    </Animated.ScrollView> */}

  </SafeAreaView>}
  </>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? 70 : 50,
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
  chipsScrollView: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 110,
    paddingHorizontal: 10
  },
  chipsIcon: {
    marginRight: 5,
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
  scrollView: {
    position: "absolute",
    bottom: 0,
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
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
    marginBottom: 100 + (Platform.OS === "android" ? 0 : 30)
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
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
    fontSize: 14,
    fontWeight: 'bold'
  }
});

