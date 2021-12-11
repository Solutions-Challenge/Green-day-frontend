import { MaterialIcons } from '@expo/vector-icons';
import { osName } from 'expo-device';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react'
import { Dimensions, ImageBackground, StatusBar, Text, TouchableOpacity, View, Image, Animated } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import useColorScheme from '../hooks/useColorScheme';


let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30
const windowWidth = Dimensions.get('window').width;
const size = windowWidth >= 600 ? 100 : 70

const ExpandImageScreen = ({ route, navigation }: any) => {
    const { item } = route.params
    const colorScheme = useColorScheme()

    const goBack = () => {
        navigation.navigate('Home')
    }

    const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

    React.useEffect(() => {
      Animated.timing(
        fadeAnim,
        {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false
        }
      ).start();
    }, [fadeAnim])

    return (<>
        {/* @ts-ignore */}
        <SharedElement id={`item.${item.key}.image`}>
            <Image source={{ uri: item.uri }} style={{ width: '100%', height: 300 }} resizeMode="cover" />
        </SharedElement>
        <SharedElement id={`item.${item.key}.material`}>
            <Text style={{ color: colorScheme === 'dark' ? 'white' : 'black', fontSize: size, position: 'absolute', left: 5, top: 0 }}>{item.material}</Text>
        </SharedElement>
        <Animated.View style={{opacity: fadeAnim, position: 'absolute', top: flipPosition + 30, left: 10, borderRadius: 60}}>
            <TouchableOpacity onPress={goBack}>
                <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>
        </Animated.View>
    </>)
}

export default ExpandImageScreen