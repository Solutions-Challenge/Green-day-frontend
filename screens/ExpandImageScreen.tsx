import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { osName } from 'expo-device';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, ImageBackground, StatusBar, Text, TouchableOpacity, View, Image, Animated, StyleSheet, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import useColorScheme from '../hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';


let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30
const windowWidth = Dimensions.get('window').width;


const ExpandImageScreen = ({ route, navigation }: any) => {
    const { item } = route.params
    const imageWidth = item.width / 3
    const colorScheme = useColorScheme()
    const [ifMLData, setIfMLData] = useState(!("mlData" in item.multi[0]))

    const goBack = () => {
        navigation.navigate('Home')
    }

    const needToProcess = () => {
        return !("mlData" in item.multi[0])
    }

    useEffect(() => {
        (async () => {
            if (ifMLData) {
                let formData = new FormData();
           
                for (let i = 0; i < item.multi.length; i++) {
                    let filename = item.multi[i].croppedImage.split('/').pop();
                    let match = /\.(\w+)$/.exec(filename as string);
                    let type = match ? `image/${match[1]}` : `image`;
                    // @ts-ignore
                    formData.append('files[]', { uri: item.multi[i].croppedImage, name: filename, type });
                }

                const MLRequest = await fetch('https://multi-service-gkv32wdswa-ue.a.run.app/predict', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                })
                const MLdata = await MLRequest.json()
                
                for (let i = 0; i < item.multi.length; i++) {
                    item.multi[i].mlData = MLdata.success[i]
                }
                setIfMLData(false)
            }
        })();
    }, []);

    return (


        <View style={{ marginTop: 120, alignItems: 'center', alignSelf: 'center' }}>
            <ScrollView>
                {item.multi.map((e: any, index: number) => {
                    return (
                        <View key={index} style={{ width: windowWidth - 40, backgroundColor: colorScheme === "dark" ? '#181818' : '#fff', marginBottom: 20, borderRadius: 10, flexDirection: 'row' }}>
                            <ImageBackground source={{ uri: e.croppedImage }} style={{ width: windowWidth / 3, height: windowWidth / 3, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, overflow: 'hidden' }}>
                                <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', marginTop: 'auto', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>{e.name}</Text>
                            </ImageBackground>

                            {ifMLData ?
                                <ActivityIndicator style={{ marginLeft: 'auto', marginRight: 'auto', alignSelf: 'center' }} size="large" color="#246EE9" /> :

                               
                                <Text style={{marginLeft: 'auto', marginRight: 'auto', color: colorScheme === "dark" ? "white":"black"}}>{item.multi[0].mlData.Material}</Text>
                                
                            }

                        </View>
                    )
                })}
            </ScrollView>

            <View style={{ position: 'absolute', top: flipPosition - 100, right: 10, backgroundColor: 'black', borderRadius: 15 }}>
                <TouchableOpacity onPress={goBack}>
                    <MaterialIcons name="cancel" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
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