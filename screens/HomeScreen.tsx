import { useState, useEffect, useContext, useCallback } from 'react';
import * as React from 'react'
import { Animated, Image, StyleSheet, View, Text, Dimensions, TouchableOpacity, TouchableHighlight, StatusBar, ImageBackground, FlatList } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import useColorScheme from '../hooks/useColorScheme';
import ImageContext from '../hooks/imageContext';
import { osName } from 'expo-device';

import Svg, { Rect } from 'react-native-svg';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const windowWidth = Dimensions.get('window').width;

const divNum = windowWidth < 600 ? 4 : 3

let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30


export default function HomeScreen({ navigation }: any) {
    const colorScheme = useColorScheme()
    const [data, setData] = useState([])
    const [uri, setUri] = useContext(ImageContext).uri
    const [imageWidth, setImageWidth] = useState(windowWidth / 1.5)

    const [checked, setChecked] = useState(new Array(11).fill(false))
    const [onLongPress, setOnLongPress] = useState(false)

    const onLongPressIn = () => {
        console.log('testing...')
        setOnLongPress(!onLongPress)
    }

    const BottomButtons = () => { 
        console.log(onLongPress)
        return (
            onLongPress ?
                (
                    <View style={{ marginLeft: 'auto', marginRight: 'auto', bottom: 130, backgroundColor: colorScheme === "dark" ? '#181818' : "white", padding: 20, borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={() => { }}
                            >
                                <View
                                    style={[styles.button, { paddingHorizontal: 5, paddingVertical: 10, width: 150, borderWidth: 1, backgroundColor: 'transparent', borderColor: '#AAAFB4', marginRight: 5 }]}
                                >
                                    <Text style={{ color: '#AAAFB4', fontSize: 20 }}>Cancel</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {

                                }}
                            >
                                <View
                                    style={[styles.button, { paddingHorizontal: 5, paddingVertical: 10, width: 150, backgroundColor: '#F07470', marginLeft: 5 }]}
                                >
                                    <Text style={{ color: 'white', fontSize: 20 }}>DELETE</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) :
                <View></View>

        )
    }

    const changeChecked = (index: number) => {
        let checkedCopy = checked
        checkedCopy[index] = !checkedCopy[index]
        setChecked(checkedCopy)
    }

    const renderItem = useCallback((data: any) => {

        const item = data.item

        return (<>

            <View style={[styles.containerTitle2]}>

                <BouncyCheckbox
                    useNativeDriver={true}
                    isChecked={checked[data.index]}
                    fillColor="#246EE9"
                    onPress={() => { changeChecked(data.index) }}
                />

                <TouchableHighlight style={{ marginBottom: 50 }}>
                    {/* @ts-ignore */}
                    <View style={[styles.card, { height: imageWidth }]}>
                        <View>
                            <TouchableOpacity
                                activeOpacity={1}
                                onLongPress={() => onLongPressIn()}
                                onPress={() => { navigation.push('Details', { item }) }}
                            >
                                <ImageBackground
                                    source={{ uri: item.uri }}
                                    style={{
                                        height: imageWidth,
                                        width: imageWidth,
                                    }}
                                    imageStyle={{ borderRadius: 10 }}
                                >

                                    <Svg
                                        width={imageWidth}
                                        height={imageWidth}
                                    >
                                        {item.multi.map((e: any, index: number) => {
                                            return (
                                                <Rect key={index} rx={5} x={imageWidth * e.boundingPoly.normalizedVertices[0].x || 0} y={imageWidth * e.boundingPoly.normalizedVertices[0].y || 0} width={(imageWidth * e.boundingPoly.normalizedVertices[2].x || 0) - (imageWidth * e.boundingPoly.normalizedVertices[0].x || 0)} height={(imageWidth * e.boundingPoly.normalizedVertices[2].y || 0) - (imageWidth * e.boundingPoly.normalizedVertices[0].y || 0)} stroke="white" strokeWidth="1" />
                                            )
                                        })}
                                    </Svg>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        </>)
    }, [checked])

    const closeRow = (rowMap: any, rowKey: any) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = async (rowMap: any, rowKey: any) => {
        closeRow(rowMap, rowKey)
        const newData = [...data]
        const prevIndex = data.findIndex((item: any) => item.key === rowKey)
        newData.splice(prevIndex, 1)
        setData(newData)
        await AsyncStorage.setItem("multi", JSON.stringify(newData))
    }

    const load = async () => {
        let ImageClassify = await AsyncStorage.getItem("multi")
        if (ImageClassify === null) {
            await AsyncStorage.setItem("multi", JSON.stringify(data))
        }
        await AsyncStorage.getItem("multi")
            .then((res) => {
                let item = JSON.parse(res as string)
                if (item != []) {
                    setData(item)
                }
            })
    }

    useEffect(() => {
        (async () => {
            load()
        })();
    }, [uri]);

    const Root = () => {
        return (<>
            {data.length === 0 ? (<>
                <View style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 25, lineHeight: 40, color: colorScheme === 'dark' ? 'white' : 'black' }}>No Picture Taken</Text>
                    <Image source={require("../assets/images/empty.png")} />
                    <Text style={{ fontSize: 20, color: colorScheme === 'dark' ? 'white' : 'black' }}>Take a picture and see</Text>
                    <Text style={{ fontSize: 20, color: colorScheme === 'dark' ? 'white' : 'black' }}>its recyclability here</Text>
                </View>
            </>) : (<>
                <FlatList
                    data={data}
                    extraData={checked}
                    // @ts-ignore
                    keyExtractor={(item, index) => item.key}
                    renderItem={renderItem}
                    style={{ marginVertical: 120 }}
                />
                <View style={{ position: 'absolute', top: flipPosition + 10, left: 20 }}>
                    <Text style={{ color: colorScheme === "dark" ? "white" : "black", fontSize: 40 }} >{data.length} Image{data.length === 1 ? "" : "s"}</Text>
                </View>

                <BottomButtons />
            </>)}
        </>
        );
    }

    return <Root />

}


const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: 80,
        backgroundColor: '#190c8d'
    },
    containerTitle: {
        padding: 20,
        paddingTop: 40,
        flexDirection: 'row',
    },
    rowBack: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 5,
    },
    backRightBtn: {
        alignItems: 'flex-end',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        marginRight: 30
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
        height: (windowWidth / divNum) + 20 + (windowWidth < 600 ? 30 : 0),
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    trash: {
        height: 50,
        width: 50,
        marginRight: 7,
    },
    containerTitle2: {
        padding: 10,
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        width: windowWidth,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    card: {
        elevation: 3,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
});
