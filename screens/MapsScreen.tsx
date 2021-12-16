import React, { useCallback, useContext } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput, Linking, FlatList } from 'react-native';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Accuracy, getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location'
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
import BottomSheet from 'reanimated-bottom-sheet'
import { StatusBar } from 'expo-status-bar';
import { WINDOW_HEIGHT } from '@gorhom/bottom-sheet';
import { read_data, write_data } from '../api/firebase';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 130;
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
  const _map = useRef<MapView>(null)
  const _scrollView = useRef(null as any)
  const [, setIsLoading] = useContext(ImageContext).isLoading
  const [mapIndex, setMapIndex] = useState(0)
  const isFocused = useIsFocused();
  const mapColors = colorScheme === "dark" ? "white" : "red"
  const bs = useRef<BottomSheet>(null)
  const [visible, setVisible] = useState(true)
  const [addingMarker, setAddingMarker] = useState({})
  const [userData, setUserData] = useState({} as any)
  const [toggle, setToggle] = useState(false)

  const [catIndex, setCatIndex] = useState(0)
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 70 })
  let onViewableItemsChanged = useRef(({ viewableItems, changed }: any) => {
    setMapIndex(changed[0].key);
  })

  const canMap = () => {
    return JSON.stringify(mapData) !== '{}' && JSON.stringify(userData) !== '{}'
  }

  const useHasChanged = (val: any) => {
    const prevVal = usePrevious(val)
    return prevVal !== val
  }

  const usePrevious = (value: any) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const hasVal1Changed = useHasChanged(mapIndex)

  useEffect(() => {
    if (canMap() && hasVal1Changed) {
      _map?.current?.animateToRegion({
        latitude: toggle ? userData[mapIndex].latitude : mapData.results[mapIndex].geometry.location.lat,
        longitude: toggle ? userData[mapIndex].longitude : mapData.results[mapIndex].geometry.location.lng,
        latitudeDelta: 0.07,
        longitudeDelta: 0.05
      }, 350)
    }
  }, [mapIndex])

  const [mapData, setmapData] = useState({} as any)

  const findLink = (href: string) => {
    let temp = href.split('"')
    href = temp[1]

    return href
  }

  useEffect(() => {
    (async () => {
      let { status } = await requestForegroundPermissionsAsync();
      setIsLoading(true)


      // Await user to grant location access
      if (status !== 'granted') {
        navigation.navigate('Home')
      }

      let location = await getCurrentPositionAsync({accuracy: Accuracy.Highest})
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
        read_data(latitude, longitude, setUserData)
      }
    })();
  }, [longitude])


  const renderInner = () => (
    <View style={[styles.panel, { paddingBottom: 600, backgroundColor: colorScheme === "dark" ? '#181818' : "white" }]}>
      <View style={{ alignItems: 'center' }}>
        <Text style={[styles.panelTitle, { color: colorScheme === 'dark' ? 'white' : 'black', marginBottom: 10 }]}>Add Your Own Markers</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={async () => {
          await getCurrentPositionAsync({ accuracy: Accuracy.Highest })
            .then((res) => {
              setAddingMarker({ latitude: res.coords.latitude, longitude: res.coords.longitude })
            })
          setVisible(false)
          bs?.current?.snapTo(1)
        }}
      >
        <Text style={styles.panelButtonTitle}>Use Your Current Location</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => { setVisible(false); bs?.current?.snapTo(1) }}
      >
        <Text style={styles.panelButtonTitle}>Mark Your Marker In The Map</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => { bs?.current?.snapTo(1) }}
      >
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  )

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colorScheme === "dark" ? '#181818' : "white" }]}>
      <View style={styles.panelHeader}>
        <View style={[styles.panelHandle, { backgroundColor: colorScheme === "dark" ? "white" : '#00000040' }]} />
      </View>
    </View>
  )

  const keyExtractor = useCallback(
    (item, index) => index.toString(),
    [mapData]
  )

  const getItemLayout = useCallback(
    (item, index)=>({
      length: CARD_WIDTH,
      offset: (CARD_WIDTH * index) + (20 * index) + (Platform.OS === "ios" ? 0:SPACING_FOR_CARD_INSET),
      index
    }),
    [mapData]
  )

  const renderItemUser = useCallback (
    ({item}:any) => {
      return (
        <View style={[styles.card, { backgroundColor: colorScheme === "dark" ? '#181818' : "white" }]}>
          <View style={styles.textContent}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text numberOfLines={1} style={[styles.cardtitle, { color: colorScheme === "dark" ? "white" : "black" }]}>({item.latitude},{item.longitude})</Text>
            </View>
          </View>
        </View>
      )

    },
    [userData]
  )

  const renderItem = useCallback(
    ({ item }:any) => {
      return (
        <View style={[styles.card, { backgroundColor: colorScheme === "dark" ? '#181818' : "white" }]}>
          <View style={styles.textContent}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              
              <View>
                <Text numberOfLines={1} style={[styles.cardtitle, { color: colorScheme === "dark" ? "white" : "black" }]}>{item.name}</Text>
                <StarRating ratings={Math.round(item.rating)} reviews={item.user_ratings_total} />
              </View>
              
              {"photos" in item &&
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => { Linking.openURL(findLink(item.photos[0].html_attributions[0])) }}>
                  <Text style={{ color: 'white' }}>Details</Text>
                </TouchableOpacity>}
            </View>
            <View>
              <TouchableOpacity
                onPress={() => { Linking.openURL(`https://maps.${Platform.OS === "android" ? "google" : "apple"}.com/?q=${item.vicinity}`) }}
                style={styles.signIn}
              >
                <Text style={[styles.textSign, { color: colorScheme === "dark" ? "white" : "black" }]}>{item.vicinity}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
      
    },
    [mapData],
  )

  return (<>
    <BottomSheet
      ref={bs}
      snapPoints={[450, 0]}
      initialSnap={1}
      enabledGestureInteraction={true}
      renderContent={renderInner}
      renderHeader={renderHeader}
      enabledInnerScrolling={false}
      enabledContentGestureInteraction={false}
    />
    {isFocused && <SafeAreaView style={{ flex: 1 }}>
      <MapView style={Platform.OS === "ios" ? StyleSheet.absoluteFill : { flex: 1 }}
        ref={_map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsBuildings={true}
        showsCompass={true}
        customMapStyle={colorScheme === 'dark' ? data : []}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta
        }}
        onPress={(e: any) => { !visible && !("latitude" in addingMarker) && (setAddingMarker({ latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude })) }}
      > 
        {canMap() && JSON.stringify(addingMarker) != '{}' && <Marker
          coordinate={{
            // @ts-ignore
            latitude: addingMarker.latitude,
            // @ts-ignore
            longitude: addingMarker.longitude,
          }}
        >
          <FontAwesome name="map-marker" style={[styles.marker]} size={30} color={'blue'} />
        </Marker>}

      {canMap() && mapData.results.map((e: any, index: any) => {
        return (<>
          <Marker
            key={index}
            coordinate={{
              latitude: e.geometry.location.lat,
              longitude: e.geometry.location.lng
            }}
            onPress={() => {
              _scrollView.current.scrollToIndex({ index: index, animated: false, viewPosition: 0.5 })
            }}
          >
            <FontAwesome name="map-marker" style={[styles.marker]} size={30} color={index == mapIndex ? "lightgreen" : mapColors} />
          </Marker>
        </>)
      })}

      {canMap() && userData.map((e: any, index: any)=>{
        return (
        <Marker
          key={index}
          coordinate={{
            latitude: e.latitude,
            longitude: e.longitude
          }}
        >
            <FontAwesome name="map-marker" style={[styles.marker]} size={30} color="yellow" />

        </Marker>
        )
      })}
    </MapView>

      {
      !visible && !("latitude" in addingMarker) && (<View style={{ alignSelf: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 20, borderRadius: 10, position: 'absolute', top: 100 }}>
        <Text style={{ color: 'white', fontSize: 20 }}>Click Anywhere to set Marker</Text>
      </View>)
    }

    {
      "latitude" in addingMarker && (<>
        {_map.current?.animateToRegion({
          // @ts-ignore
          latitude: addingMarker.latitude,
          // @ts-ignore
          longitude: addingMarker.longitude,
          latitudeDelta: 0.0007,
          longitudeDelta: 0.0001
        })}
        <View
          style={{ position: 'absolute', alignItems: 'flex-end', justifyContent: 'center', left: 20, width: width - 40, height: 200, top: 50, backgroundColor: 'rgba(0, 0, 0, 0.5)', flexDirection: 'row', padding: 10, borderRadius: 10 }}
        >
          <TouchableOpacity
            onPress={() => { setVisible(true); setAddingMarker({}) }}
          >
            <View
              style={[styles.button, { paddingHorizontal: 5, paddingVertical: 10, width: 150, borderWidth: 1, backgroundColor: 'transparent', borderColor: '#F07470', marginRight: 5 }]}
            >
              <Text style={{ color: '#F07470', fontSize: 20 }}>Cancel</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            // @ts-ignore
            onPress={() => { setVisible(true); write_data(addingMarker.latitude, addingMarker.longitude); setAddingMarker({}); read_data(latitude, longitude, setUserData) }}
          >
            <View
              style={[styles.button, { paddingHorizontal: 5, paddingVertical: 10, width: 150, backgroundColor: '#a4d2ac', marginLeft: 5 }]}
            >
              <Text style={{ color: 'white', fontSize: 20 }}>Confirm</Text>
            </View>
          </TouchableOpacity>
        </View>
        <MapView>
          <Marker
            coordinate={{
              // @ts-ignore
              latitude: addingMarker.latitude,
              // @ts-ignore
              longitude: addingMarker.longitude,
            }}
          >

            <FontAwesome name="map-marker" style={[styles.marker, { width: 100, height: 100 }]} size={50} color={'blue'} />
          </Marker>

        </MapView>
      </>)
    }

    {
      visible && (<>

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
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          removeClippedSubviews={true}
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
          onScrollToIndexFailed={(err) => { console.log(err) }}
          data={toggle ? userData : mapData.results}
          keyExtractor={keyExtractor}
          renderItem={toggle ? renderItemUser : renderItem}
          getItemLayout={getItemLayout}
        >
        </FlatList>
        <TouchableOpacity style={{ position: 'absolute', bottom: 250 + (Platform.OS === 'ios' ? 50 : 0), right: 25 }} onPress={() => { bs?.current?.snapTo(0) }}>
          <View style={{ backgroundColor: colorScheme === "light" ? 'white' : 'black', borderRadius: 25 }}>
            <AntDesign name="pluscircleo" size={50} color={colorScheme === "dark" ? 'white' : 'black'} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ position: 'absolute', bottom: 250 + (Platform.OS === 'ios' ? 50 : 0), right: 100 }} onPress={()=>setToggle(!toggle)}>
          <View style={{ backgroundColor: colorScheme === "light" ? 'white' : 'black', borderRadius: 25 }}>
            {
              !toggle ? 
                <Ionicons name="person-circle-outline" size={50} color={colorScheme === "dark" ? 'white' : 'black'} />:
                <Ionicons name="search-circle-outline"  size={50} color={colorScheme === "dark" ? 'white' : 'black'} />
            }
          </View>
        </TouchableOpacity>
      </>)
    }

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
    width: 200,
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
    justifyContent: 'center',
    borderRadius: 10,
    width: 80,
    backgroundColor: '#190c8d'
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
    fontWeight: 'bold',
    marginTop: 10,
  },

  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
});

