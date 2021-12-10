import { MaterialIcons } from '@expo/vector-icons';
import { osName } from 'expo-device';
import React from 'react'
import { Dimensions, ImageBackground, StatusBar, Text, TouchableOpacity, View, Image } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';


let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30
const windowWidth = Dimensions.get('window').width;
const size = windowWidth >= 600 ? 100: 50

const ExpandImageScreen = ({ navigation, route  }: any) => {
    const {item} = route.params

    const goBack = () => {
        navigation.navigate('Home')
    }

    return (<View>
        {/* @ts-ignore */}
        <SharedElement id={`item.${item.uri}.image`}>
            <Image source={{ uri: item.uri }} style={{ width: '100%', height: 300 }} resizeMode="cover" />
        </SharedElement>
        <SharedElement id={`item.${item.uri}.material`}>
            <Text style={{ color: 'white', fontSize: size, position: 'absolute', top: -size-15}}>{item.material}</Text>
        </SharedElement>
        <View style={{ position: 'absolute', top: flipPosition + 30, left: 10, backgroundColor: 'black', borderRadius: 60 }}>
            <TouchableOpacity onPress={goBack}>
                <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>
        </View>
    </View>)
}

export default ExpandImageScreen