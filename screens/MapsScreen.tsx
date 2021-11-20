import * as React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar, TextInput, ScrollView, Animated } from 'react-native';
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

let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30
const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
const latitudeDelta = 0.0922
const longitudeDelta = 0.0421

export default function App({ navigation }: any) {
  const colorScheme = useColorScheme();
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const _map = useRef(null as any)

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

  useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= markers.length) {
        index = markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      // @ts-ignore
      clearTimeout(regionTimeout);
      const regionTimeout = setTimeout(() => {
        if( mapIndex !== index ) {
          mapIndex = index;
          const { coordinate } = markers[index];
          _map.current.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: latitudeDelta,
              longitudeDelta: longitudeDelta
            },
            550
          );
        }
      }, 10);
    });
  });

  const categories = [
    {
        name: "Wood",
        icon: <MaterialCommunityIcons name="food" style={styles.chipsIcon} size={18} />
    },
    {
        name: "Metal",
        icon: <MaterialCommunityIcons name="food-fork-drink" style={styles.chipsIcon} size={18} />
    },
    {
        name: "Plastic",
        icon: <MaterialCommunityIcons name="food-fork-drink" style={styles.chipsIcon} size={18} />
    },
    {
        name: "Food",
        icon: <MaterialCommunityIcons name="food-fork-drink" style={styles.chipsIcon} size={18} />
    },
  ]

  if (Platform.OS === 'android'){
    setStatusBarHidden(true, 'none')
  }

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
      ref={_map}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      customMapStyle={colorScheme === 'dark' ? data: []}
      region={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta
      }}
    >
      {markers.map((e, index)=>{
        return (
          <Marker
            key={index}
            coordinate={{
              latitude: e.coordinate.latitude,
              longitude: e.coordinate.longitude
            }}
            title={e.title}
            description={e.description} 
          >
            <FontAwesome name="map-marker" size={50} color={colorScheme === "dark" ? 'white': 'red'} />
          </Marker>
        )
      })}
    </MapView>

    <View style={styles.searchBox}>
      <TextInput
        placeholder="Search Here"
        placeholderTextColor="#000"
        autoCapitalize="none"
        style={{flex:1, padding:0}}
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
      {categories.map((e, index)=>{
        return (<TouchableOpacity key={index} style={styles.chipsItem}>
          {e.icon}
          <Text>{e.name}</Text>
        </TouchableOpacity>)
      })}

    </ScrollView>

    <Animated.ScrollView
      horizontal
      disableScrollViewPanResponder={true}
      scrollEventThrottle={1}
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
      pagingEnabled
      snapToInterval={CARD_WIDTH+20}
      snapToAlignment="center"
      decelerationRate="fast"
      contentInset={{
        top: 0,
        left: SPACING_FOR_CARD_INSET,
        bottom: 0,
        right: SPACING_FOR_CARD_INSET
      }}
      contentContainerStyle={{
        paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET: 0
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
        {useNativeDriver: true}
      )}
    >
      {markers.map((e, index)=>{
        return(<View style={styles.card} key={index}>
          <Image 
            source={e.image}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.textContent}>
            <Text numberOfLines={1} style={styles.cardtitle}>{e.title}</Text>
            <StarRating ratings={e.ratings} reviews={e.reviews} />
            <Text numberOfLines={1} style={styles.cardDescription}>{e.description}</Text>
            <View style={styles.button}>
              <TouchableOpacity
              onPress={()=>{}}
              style={[styles.signIn, {
                borderColor: '#FF6347',
                borderWidth: 1,
              }]}
              >
                <Text style={[styles.textSign, {
                  color: '#FF6347',
                }]}>
                  Order Now
                </Text>

              </TouchableOpacity>
            </View>
          </View>
        </View>)
        
      })}
    </Animated.ScrollView>

    <View style={{ position: 'absolute', top: flipPosition + 100, left: 10, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 60 }}>
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
    position:'absolute', 
    marginTop: Platform.OS === 'ios' ? 20 : 12, 
    flexDirection:"row",
    backgroundColor: '#fff',
    width: '70%',
    alignSelf:'center',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  chipsItem: {
    flexDirection:"row",
    backgroundColor:'#fff', 
    borderRadius:20,
    padding:8,
    paddingHorizontal:20, 
    marginHorizontal:10,
    height:35,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  chipsScrollView: {
    position:'absolute', 
    top:Platform.OS === 'ios' ? 80 : 70, 
    paddingHorizontal:10,
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
    // padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
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
    width:50,
    height:50,
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
      padding:5,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 3
  },
  textSign: {
      fontSize: 14,
      fontWeight: 'bold'
  }
});
