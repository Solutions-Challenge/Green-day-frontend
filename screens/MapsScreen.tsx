import React, { useCallback, useContext } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Linking, FlatList, LogBox } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TouchableOpacity as Touch } from 'react-native';
import { AntDesign, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Accuracy, getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location'
import { useEffect, useRef, useState } from 'react';
import useColorScheme from '../hooks/useColorScheme';
import mapStyleDark from '../mapStyle.json';
import mapStyleLight from '../mapStyleLight.json'
import { Platform } from 'expo-modules-core';
import { Image } from 'react-native'
import StarRating from '../components/StarRating';
import fetchData from '../api/googleMaps'
import fetchCategoryData from '../components/categories';
import categories from '../components/categories'
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageContext from '../hooks/imageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import BottomSheet from 'reanimated-bottom-sheet'
import { read_data_hash, write_data_hash } from '../api/firebase';
import { TextInput } from 'react-native-paper'


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

export default function App({ navigation, route }: any) {
  const colorScheme = useColorScheme();
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const _map = useRef<MapView>(null)
  const _scrollView = useRef<FlatList>(null)
  const [, setIsLoading] = useContext(ImageContext).isLoading
  const [mapIndex, setMapIndex] = useState(0)
  const isFocused = useIsFocused();
  const mapColors = colorScheme === "dark" ? "white" : "red"
  const bs = useRef<BottomSheet>(null)
  const [visible, setVisible] = useState(true)
  const [addingMarker, setAddingMarker] = useState({})
  const [userData, setUserData] = useState({} as any)
  const [partialUserData, setPartialUserData] = useState({} as any)
  const [toggle, setToggle] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [mapType, setMapType] = useState(true)
  const [switchToConfirm, setSwitchToConfirm] = useState(false)
  const _categoryView = useRef<FlatList>(null)
  const [categories, setCategories] = useState([] as any)

  const [catIndex, setCatIndex] = useState(-1)
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 70, minimumViewTime: 300, })
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
        latitude: toggle ? partialUserData[mapIndex].coordinates.latitude : mapData.results[mapIndex].geometry.location.lat,
        longitude: toggle ? partialUserData[mapIndex].coordinates.longitude : mapData.results[mapIndex].geometry.location.lng,
        latitudeDelta: 0.007,
        longitudeDelta: 0.005
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

      let location = await getCurrentPositionAsync({ accuracy: Accuracy.Highest })
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
        // TODO: Figure out why reading this data gives a strange error on android
        await read_data_hash(latitude, longitude, setUserData)
        _map?.current?.animateToRegion({
          latitude: latitude,
          longitude: longitude,
          longitudeDelta: longitudeDelta,
          latitudeDelta: latitudeDelta
        })
      }
    })();
  }, [longitude])

  useEffect(() => {
    if (canMap() && userData.length > 0) {
      _scrollView?.current?.scrollToIndex({ index: 0, animated: true, viewOffset: 0.5 })
    }
  }, [toggle, catIndex])

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
    [mapData, toggle, userData, catIndex]
  )

  const getItemLayout = useCallback(
    (item, index) => ({
      length: CARD_WIDTH,
      offset: (CARD_WIDTH * index) + (20 * index) + (Platform.OS === "ios" ? 0 : SPACING_FOR_CARD_INSET),
      index
    }),
    [mapData]
  )

  const getItemLayoutCategory = useCallback(
    (item, index) => ({
      length: 130,
      offset: (130 * index) + (20 * index),
      index
    }),
    [userData]
  )


  useEffect(() => {
    if (catIndex === -1) {
      setPartialUserData(userData)
    }
    else {
      let filteredData = userData.filter((e: any) => { return e.name == categories[catIndex - 1].name })

      if (filteredData.length > 0) {
        setPartialUserData(filteredData)
      }
      else {
        setPartialUserData(userData)
      }
    }
  }, [catIndex, userData])

  useEffect(() => {

    (async () => {

      setCatIndex(-1)
      setToggle(false)
      
      const data = await fetchCategoryData()
      setCategories(data)
  
      const { material } = route.params;
      if (canMap() && material != "") {
        for (let i = 0; i < categories.length; i++) {
          if (categories[i].name === material) {
            setCatIndex(i + 1)
            setToggle(true)
            _categoryView.current?.scrollToIndex({ index: i, animated: true, viewPosition: 0.5 })
  
            navigation.setParams({
              material: ''
            });
          }
        }
      }
    })();

  }, [isFocused, userData])

  const renderItemUser = useCallback(
    ({ item }: any) => {
      return (
        <View style={[styles.card, { backgroundColor: colorScheme === "dark" ? '#181818' : "white" }]}>
          <View style={styles.textContent}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Text numberOfLines={1} style={[styles.cardtitle, { color: colorScheme === "dark" ? "white" : "black", width: 150 }]}>{item.title}</Text>
              <Touch
                style={{ marginLeft: 'auto' }}
                onPress={() => { Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${item.coordinates.latitude},${item.coordinates.longitude}`) }}
              >
                <View
                  style={[styles.chipsItem, { backgroundColor: "white", width: 130 }]}>
                  <Image source={{ uri: item.icon }} style={{ width: 20, height: 20, marginRight: 5 }} />
                  <Text>{item.name}</Text>
                </View>
              </Touch>
            </View>
            <Text style={[styles.cardDescription, { color: colorScheme === "dark" ? "white" : "black" }]}>{item.description}</Text>
          </View>
        </View>
      )

    },
    [userData, colorScheme]
  )

  const renderItem = useCallback(
    ({ item }: any) => {
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
                  style={[styles.button, { backgroundColor: '#246EE9' }]}
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
    [mapData, colorScheme],
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
        mapType={mapType ? 'standard' : 'satellite'}
        customMapStyle={colorScheme === 'dark' ? mapStyleDark : mapStyleLight}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta
        }}
        onPress={(e: any) => { !visible && !("latitude" in addingMarker) && (setAddingMarker({ latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude })) }}
        onLongPress={(e: any) => { (setAddingMarker({ latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude })); setVisible(false) }}
      >
        {canMap() && JSON.stringify(addingMarker) != '{}' && <Marker
          coordinate={{
            // @ts-ignore
            latitude: addingMarker.latitude,
            // @ts-ignore
            longitude: addingMarker.longitude,
          }}
        >
          <FontAwesome name="map-marker" size={30} color={mapColors} />
        </Marker>}

        {canMap() && !toggle && mapData.results.map((e: any, index: any) => {
          return (
            <Marker
              coordinate={{
                latitude: e.geometry.location.lat,
                longitude: e.geometry.location.lng
              }}
              onPress={() => {
                _scrollView?.current?.scrollToIndex({ index: index, animated: true, viewPosition: 0.5 })
              }}
            >
              <FontAwesome name="map-marker" size={30} color={index == mapIndex ? "lightgreen" : mapColors} />
            </Marker>
          )
        })}

        {canMap() && toggle && partialUserData.map((e: any, index: any) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: e.coordinates.latitude,
                longitude: e.coordinates.longitude
              }}
              onPress={() => {
                _scrollView?.current?.scrollToIndex({ index: index, animated: true, viewPosition: 0.5 })
              }}
            >
              <FontAwesome name="map-marker" size={30} color={index == mapIndex ? "lightgreen" : mapColors} />
            </Marker>
          )
        })}
      </MapView>

      {
        !visible && !("latitude" in addingMarker) && (
          <View style={{ alignSelf: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 20, borderRadius: 10, position: 'absolute', top: 100 }}>
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
            style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', left: 20, top: Platform.OS === 'ios' ? 140 : 120, width: width - 40, height: 300, backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 10, borderRadius: 10 }}
          >
            {switchToConfirm ? <>
              <Text style={{ color: 'white', fontSize: 30, width: width - 40, paddingLeft: 40, paddingBottom: 10 }}>Category</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignContent: 'space-between', justifyContent: 'center' }}>
                {categories.map((item:any, index:any) => {
                  return (<>
                    <TouchableOpacity
                      key={item.key}
                      onPress={() => {
                        setCatIndex(item.key)
                      }}
                      style={[styles.chipsItem, { backgroundColor: item.key === catIndex ? "#ADD8E6" : "white", marginBottom: 10, width: 130 }]}>
                      <Image source={{ uri: item.icon }} style={{ width: 20, height: 20, marginRight: 5 }} />
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  </>)
                })}
              </View>

            </> :
              <View style={{ flexDirection: 'column' }}>
                <TextInput
                  placeholder={"Title: "}
                  autoComplete={''}
                  error={title === ""}
                  placeholderTextColor={'black'}
                  mode={"outlined"}
                  multiline={false}
                  dense={true}
                  style={styles.inputStyle}
                  value={title}
                  onChangeText={(res) => setTitle(res)} />
                <TextInput
                  placeholder={"Description: "}
                  autoComplete={''}
                  error={message === ""}
                  placeholderTextColor={'black'}
                  mode={"outlined"}
                  multiline={true}
                  numberOfLines={4}
                  dense={true}
                  style={styles.inputStyle}
                  spellCheck={true}
                  value={message}
                  onChangeText={(res) => setMessage(res)} />
              </View>}
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => {
                  if (switchToConfirm) {
                    setSwitchToConfirm(false)
                  }
                  else {
                    setVisible(true);
                    setAddingMarker({});
                    setCatIndex(-1);
                    setTitle('');
                    setMessage('')
                  }
                }}
              >
                <View
                  style={[styles.button, { paddingHorizontal: 5, paddingVertical: 10, width: 150, height: 50, borderWidth: 1, backgroundColor: 'transparent', borderColor: switchToConfirm ? '#246EE9' : '#F07470', marginRight: 5 }]}
                >
                  <Text style={{ color: switchToConfirm ? '#246EE9' : '#F07470', fontSize: 20 }}>{switchToConfirm ? "Previous" : "Cancel"}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (title !== "" && message !== "") {

                    if (switchToConfirm && catIndex !== -1) {
                      setVisible(true);
                      //@ts-ignore
                      write_data_hash(addingMarker.latitude, addingMarker.longitude, title, message, categories[catIndex - 1].icon, categories[catIndex - 1].name);
                      setVisible(true);
                      setAddingMarker({});
                      setCatIndex(-1);
                      setTitle('');
                      setMessage('');
                      setSwitchToConfirm(false);
                      read_data_hash(latitude, longitude, setUserData);
                    }
                    else {
                      setSwitchToConfirm(true)
                      setCatIndex(-1)
                    }

                  }
                }}
              >
                <View
                  style={[styles.button, { paddingHorizontal: 5, paddingVertical: 10, width: 150, height: 50, backgroundColor: switchToConfirm ? '#a4d2ac' : '#246EE9', marginLeft: 5 }]}
                >
                  <Text style={{ color: 'white', fontSize: 20 }}>{switchToConfirm ? "Confirm" : "Next"}</Text>
                </View>
              </TouchableOpacity>
            </View>
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

              <FontAwesome name="map-marker" size={50} color={mapColors} />
            </Marker>

          </MapView>
        </>)
      }

      <View style={styles.searchBox}>
        <View style={{ backgroundColor: 'white', width: '50%', borderRadius: 10 }}>
          <TouchableOpacity
            style={{ alignSelf: 'center', height: 35, top: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: mapType ? '#246EE9' : 'white' }}
            onPress={() => setMapType(true)}
          >
            <Text style={{ alignSelf: 'center', marginTop: 'auto', marginBottom: 'auto', color: mapType ? 'white' : 'black' }}>Standard</Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: "white", width: '50%', borderRadius: 10 }}>
          <TouchableOpacity
            style={{ alignSelf: 'center', height: 35, top: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: !mapType ? '#246EE9' : 'white' }}
            onPress={() => setMapType(false)}
          >
            <Text style={{ alignSelf: 'center', marginTop: 'auto', marginBottom: 'auto', color: !mapType ? 'white' : 'black' }}>Satellite</Text>
          </TouchableOpacity>
        </View>
      </View>
      {
        visible && partialUserData.length > 0 && (<>


          <FlatList
            ref={_categoryView}
            horizontal
            showsHorizontalScrollIndicator={false}
            getItemLayout={getItemLayoutCategory}
            style={styles.chipsScrollView}
            contentContainerStyle={{
              paddingRight: 20
            }}
            data={categories}
            renderItem={({ item }: any) => {
              return (
                (item.key != 0 ? <>
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => {
                      setCatIndex(item.key)
                      setToggle(true)
                    }}
                    style={[styles.chipsItem, { backgroundColor: item.key === catIndex ? "#ADD8E6" : "white" }]}>
                    <Image source={{ uri: item.icon }} style={{ width: 20, height: 20, marginRight: 5 }} />
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                  {item.key === catIndex &&
                    <View style={{ backgroundColor: 'white', borderRadius: 15, width: 30, height: 30, top: 3 }}>
                      <Touch style={{ alignSelf: 'center', bottom: 0.5 }} onPress={() => { setCatIndex(-1) }}>
                        <Feather name="x-circle" size={30} color="black" />
                      </Touch>
                    </View>
                  }
                </> :
                  <View key={item.key} />)
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
            onScrollToIndexFailed={() => { }}
            data={toggle ? partialUserData : mapData.results}
            keyExtractor={keyExtractor}
            renderItem={canMap() && toggle ? renderItemUser : renderItem}
            getItemLayout={getItemLayout}
          >
          </FlatList>
          <Touch style={{ position: 'absolute', bottom: 250 + (Platform.OS === 'ios' ? 50 : 0), right: 25 }} onPress={() => { bs?.current?.snapTo(0) }}>
            <View style={{ backgroundColor: colorScheme === "light" ? 'white' : 'black', borderRadius: 25 }}>
              <AntDesign name="pluscircleo" size={50} color={colorScheme === "dark" ? 'white' : 'black'} />
            </View>
          </Touch>
          <Touch style={{ position: 'absolute', bottom: 250 + (Platform.OS === 'ios' ? 50 : 0), right: 100 }} onPress={() => { setToggle(!toggle); }}>
            <View style={{ backgroundColor: colorScheme === "light" ? 'white' : 'black', borderRadius: 25 }}>
              {
                !toggle ?
                  <Ionicons name="person-circle-outline" size={50} color={colorScheme === "dark" ? 'white' : 'black'} /> :
                  <Ionicons name="search-circle-outline" size={50} color={colorScheme === "dark" ? 'white' : 'black'} />
              }
            </View>
          </Touch>
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
    width: '50%',
    alignSelf: 'center',
    borderRadius: 5,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    height: 45
  },
  chipsScrollView: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 130 : 120,
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
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 35,
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
  inputStyle: {
    marginBottom: 10,
    width: 300,
  },
});