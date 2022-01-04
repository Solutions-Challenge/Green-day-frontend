import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { osName } from 'expo-device';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, ImageBackground, StatusBar, Text, TouchableOpacity, View, Image, Animated, StyleSheet, ActivityIndicator, ListRenderItem } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import useColorScheme from '../hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';


let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30
const windowWidth = Dimensions.get('window').width;


const ExpandImageScreen = ({ route, navigation }: any) => {
    const { item } = route.params
    const colorScheme = useColorScheme()

    let copy = []
    for (let i = 0; i < item.multi.length; i++) {
        if ("mlData" in item.multi[i]) {
            copy.push(true)
        } 
        else {
            copy.push(false)
        }
    }
    const [ifMLData, setIfMLData] = useState(copy)

    const [catIndex, setCatIndex] = useState(Array(copy.length).fill(0))


    const goBack = () => {
        navigation.navigate('Home')
    }

    const renderItem: ListRenderItem<any> = useCallback(({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    let catCopy = [...catIndex]
                    catCopy[item.position] = index
                    setCatIndex(catCopy)
                }}
                key={index}
                style={[styles.chipsItem, { backgroundColor: index === catIndex[item.position] ? "#ADD8E6" : "white", marginTop: 20 }]}>
                <Text>{item.Material}</Text>
            </TouchableOpacity>

        )
    }, [ifMLData, catIndex])

    useEffect(() => {
        (async () => {
            if (!ifMLData[0]) {
                let formData = new FormData();
                let temp = 0

                for (let i = 0; i < item.multi.length; i++) {
                    let filename = item.multi[i].croppedImage.split('/').pop();
                    let match = /\.(\w+)$/.exec(filename as string);
                    let type = match ? `image/${match[1]}` : `image`;
                    // @ts-ignore
                    formData.append('files[]', { uri: item.multi[i].croppedImage, name: filename, type });

                    if (temp == 2 || i + 1 == item.multi.length) {
                        const MLRequest = await fetch('https://multi-service-gkv32wdswa-ue.a.run.app/predict', {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'content-type': 'multipart/form-data'
                            }
                        })

                        const MLdata = await MLRequest.json()

                        let ifmlCopy = [...ifMLData]
                        for (let j = temp; j >= 0; j--) {
                            item.multi[i - j].mlData = MLdata.success[j]
                            for (let k = 0; k < item.multi[i-j].mlData.length; k++) {
                                item.multi[i - j].mlData[k].position = i-j
                            }
                            ifmlCopy[i - j] = true
                        }

                        let k = 0
                        while (ifmlCopy[k] == false) {
                            ifmlCopy[k] = true
                            k++
                        }

                        setIfMLData(ifmlCopy)

                        temp = -1
                        formData = new FormData()

                    }

                    temp += 1
                }
            }
        })();
    }, []);

    const keyExtractor = useCallback(
        (item, index) => index.toString(),
        []
    )

    return (


        <View style={{ marginTop: 120, alignItems: 'center', alignSelf: 'center' }}>
            <ScrollView>
                {item.multi.map((e: any, index: number) => {
                    return (
                        <View key={index} style={{ width: windowWidth - 40, backgroundColor: colorScheme === "dark" ? '#181818' : '#fff', marginBottom: 20, borderRadius: 10, flexDirection: 'row' }}>
                            <ImageBackground source={{ uri: e.croppedImage }} style={{ width: windowWidth / 3, height: windowWidth / 3, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, overflow: 'hidden' }}>
                                <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', marginTop: 'auto', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>{e.name}</Text>
                            </ImageBackground>

                            {ifMLData[index] ?
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <>
                                        <FlatList
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{
                                                paddingRight: 20
                                            }}
                                            data={item.multi[index].mlData}
                                            renderItem={renderItem}
                                            keyExtractor={keyExtractor}
                                        />
                                    </>
                                    <Text>{item.multi[index].mlData[catIndex[item.multi[index].mlData[0].position]].Recyclability}</Text>
                                </View>
                                :
                                <ActivityIndicator style={{ marginLeft: 'auto', marginRight: 'auto', alignSelf: 'center' }} size="large" color="#246EE9" />

                            }

                        </View>
                    )
                })}
            </ScrollView >

            <View style={{ position: 'absolute', top: flipPosition - 100, right: 10, backgroundColor: 'black', borderRadius: 15 }}>
                <TouchableOpacity onPress={goBack}>
                    <MaterialIcons name="cancel" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </View >
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
})

export default ExpandImageScreen


// if (i % 2 === 0 && i !== 0 || i + 1 == item.multi.length) {
                    //     const MLRequest = await fetch('http://10.0.0.222:8080/predict', {
                    //         method: 'POST',
                    //         body: formData,
                    //         headers: {
                    //             'content-type': 'multipart/form-data'
                    //         }
                    //     })

                    //     const MLdata = await MLRequest.json()

                    //     for (let j = 0; j <= temp; j++) {

                    //         if (i - j < item.multi.length) {
                    //             if ("success" in MLdata) {
                    //                 item.multi[i - j].mlData = MLdata.success[j]
                    //             }
                    //             else {
                    //                 item.multi[i - j].mlData = [{
                    //                     "Material": "None",
                    //                     "Recyclability": "None"
                    //                 }]
                    //                 console.log(MLdata.error)
                    //             }
                    //         }
                    //     }

                    //     formData = new FormData()
                    //     temp = 0
                    // }