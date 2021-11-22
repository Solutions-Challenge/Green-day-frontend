import * as React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar, TextInput, ScrollView, Animated, Button, Linking } from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { osName } from 'expo-device';
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location'
import { useEffect, useRef, useState } from 'react';
import useColorScheme from '../hooks/useColorScheme';
import data from '../mapStyle.json'
import { markers } from './tempMapData'
import { Platform } from 'expo-modules-core';
import { setStatusBarHidden } from 'expo-status-bar';
import { Image } from 'react-native'
import StarRating from '../components/StarRating';
import fetchData from '../api/googleMaps'
import {categories} from '../components/categories'

let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30
const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 150;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
const latitudeDelta = 0.0922
const longitudeDelta = 0.121

const getFullText = (address:string) => {
  let texts = address.split(' ')
  let ans = ""
  for (let i = 0; i < texts.length-1; i++) {
    ans += texts[i] + "%20"
  }
  return ans
}

export default function App({ navigation }: any) {
  const colorScheme = useColorScheme();
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const _map = useRef(null as any)
  const _scrollView = useRef(null as any)

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

  const findLink = (href:string) => {
    let temp = href.split('"')
    href = temp[1]

    return href
  }

  useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      if (JSON.stringify(mapData) !== '{}') {
        let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
        if (index >= mapData.results.length) {
          index = mapData.results.length - 1;
        }
        if (index <= 0) {
          index = 0;
        }
  
        // @ts-ignore
        clearTimeout(regionTimeout);
        const regionTimeout = setTimeout(() => {
          if (mapIndex !== index && JSON.stringify(mapData) !== '{}') {
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

  if (Platform.OS === 'android') {
    setStatusBarHidden(true, 'none')
  }

  const goBack = () => {
    navigation.navigate('Home')
  }

  const [mapData, setmapData] = useState({} as any)

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

  useEffect(() => { 
    if (latitude !== 0 && longitude !== 0) {
      fetchData(latitude, longitude, setmapData) 
    } 
  }, [longitude])
  
  let interpolations = {}
  {JSON.stringify(mapData) !== '{}' ? interpolations = mapData.results.map((marker:any, index:any) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: "clamp"
    });

    return { scale };
  }):interpolations={}};

  return (<>

    <MapView style={StyleSheet.absoluteFill}
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
      { JSON.stringify(mapData) !== '{}' ? mapData.results.map((e:any, index:any) => {
        // @ts-ignore
        const scale = (interpolations[index].scale)
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
              let x = (markerId * CARD_WIDTH)
              _scrollView.current.scrollTo({ x: x, y: 0, animated: true })
            }}
          >
            <Animated.View style={[
              {
             
                height: '150%',
                width: '150%',
              },
              {
                transform: [
                  {
                    scale: scale
                  },
                ],
              },
            ]}>
              <FontAwesome name="map-marker" size={50} color={colorScheme === "dark" ? "white" : "red"} />
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
      {JSON.stringify(mapData) !== '{}' ? mapData.results.map((e:any, index:any) => {
        return (<View style={styles.card} key={index}>
          <View style={styles.textContent}>
            <Image
              source={{uri: e.icon}}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text numberOfLines={1} style={styles.cardtitle}>{e.name}</Text>
                <StarRating ratings={Math.round(e.rating)} reviews={e.user_ratings_total} />
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
                <Text style={{color: 'blue', textDecorationLine: 'underline'}}>{e.vicinity}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>)

      }):<></>}
    </Animated.ScrollView>

    <View style={{ position: 'absolute', top: Platform.OS === "ios" ? 40 : flipPosition + 100, left: 10, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 60 }}>
      <TouchableOpacity onPress={goBack}>
        <Ionicons name="ios-arrow-back-sharp" size={30} color="white" />
      </TouchableOpacity>
    </View>

  </>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? 40 : 12,
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
    top: Platform.OS === 'ios' ? 100 : 70,
    paddingHorizontal: 10,
    width: '100%',
  },
  chipsIcon: {
    marginRight: 5,
  },
  scrollView: {
    position: "absolute",
    bottom: 20,
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
    fontWeight: 'bold',
    marginBottom: 5
  }
});
