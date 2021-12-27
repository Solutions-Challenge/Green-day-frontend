import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { osName } from 'expo-device';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react'
import { Dimensions, ImageBackground, StatusBar, Text, TouchableOpacity, View, Image, Animated, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import useColorScheme from '../hooks/useColorScheme';


let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30
const windowWidth = Dimensions.get('window').width;


const ExpandImageScreen = ({ route, navigation }: any) => {
    const { item } = route.params
    const imageWidth = item.width / 3
    const colorScheme = useColorScheme()

    const goBack = () => {
        navigation.navigate('Home')
    }

    return (<View style={{ marginTop: 120, alignItems: 'center', alignSelf: 'center' }}>
        <ScrollView>

            {item.multi.map((e: any, index: number) => {
                return (<View key={index} style={{ width: windowWidth - 40, backgroundColor: colorScheme === "dark" ? '#181818' : '#fff', marginBottom: 20, borderRadius: 10, flexDirection: 'row' }}>
                    <ImageBackground key={index} source={{ uri: e.croppedImage }} style={{ width: windowWidth / 3, height: windowWidth / 3 }} imageStyle={{ borderBottomLeftRadius: 10, borderTopLeftRadius: 10 }}>
                    <Text style={{ color: colorScheme === 'dark' ? 'white' : 'black', fontSize: 20, textAlign: 'center', marginTop: 'auto' }}>{e.mlData.Material}</Text>
                        <View style={[styles.recycleButton, { alignSelf: 'center', marginBottom: 10}]}>
                            <Text style={{ color: 'white', textAlign: 'center'}}>{e.mlData.Recyclability}</Text>
                        </View>
                    </ImageBackground>
                </View>)
            })}
        </ScrollView>

        <View style={{ position: 'absolute', top: flipPosition - 100, right: 10, backgroundColor: 'black', borderRadius: 15 }}>
            <TouchableOpacity onPress={goBack}>
                <MaterialIcons name="cancel" size={30} color="white" />
            </TouchableOpacity>
        </View>
    </View>)
}

const styles = StyleSheet.create({
    recycleButton: {
        backgroundColor: "#190c8d",
        fontSize: 20,
        fontWeight: "600",
        borderRadius: 50,
        paddingHorizontal: 10,
        paddingVertical: 5,
        height: 30,
        width: 130
    }
})

export default ExpandImageScreen