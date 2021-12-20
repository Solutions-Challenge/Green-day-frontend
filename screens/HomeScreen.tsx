import { useState, useEffect, useContext } from 'react';
import * as React from 'react'
import { Animated, Image, StyleSheet, View, Text, Dimensions, TouchableOpacity, TouchableHighlight, StatusBar, ImageBackground } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import useColorScheme from '../hooks/useColorScheme';
import ImageContext from '../hooks/imageContext';
import { SwipeListView } from 'react-native-swipe-list-view';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { osName } from 'expo-device';

import Svg, { Rect } from 'react-native-svg';

const windowWidth = Dimensions.get('window').width;

const divNum = windowWidth < 600 ? 4 : 3

let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30


export default function HomeScreen({ navigation }: any) {
    const colorScheme = useColorScheme()
    const [data, setData] = useState([])
    const [uri, setUri] = useContext(ImageContext).uri

    const VisibleItem = (props: any) => {
        const { data, rowHeightAnimatedValue, removeRow, rightActionState } = props

        if (rightActionState) {
            Animated.timing(rowHeightAnimatedValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start(() => {
                removeRow();
            });
        }

        const item = data.item
        const imageWidth = item.width / 3

        return (
            <TouchableHighlight style={{ marginBottom: 50 }}>
                {/* @ts-ignore */}
                <Animated.View style={{ height: rowHeightAnimatedValue }}>
                    <View style={styles.card}>
                        <View style={[styles.containerTitle2, { backgroundColor: colorScheme === "dark" ? '#181818' : '#fff' }]}>
                            <TouchableOpacity activeOpacity={1} onPress={() => { navigation.push('Details', { item }) }}>
                                <ImageBackground
                                    source={{ uri: item.uri }}
                                    style={{
                                        height: imageWidth,
                                        width: imageWidth,
                                        borderRadius: 10
                                    }}>
                                    <Svg
                                        width={imageWidth}
                                        height={imageWidth}
                                    >
                                        {item.multi.map((e:any, index:number)=>{
                                            return (
                                                <Rect key={index} rx={5} x={imageWidth * e.vertices[0].x} y={imageWidth * e.vertices[0].y} width={imageWidth * e.vertices[2].x-imageWidth * e.vertices[0].x} height={imageWidth * e.vertices[2].y-imageWidth * e.vertices[0].y} stroke="white" strokeWidth="1" />
                                            )
                                        })}
                                    </Svg>
                                </ImageBackground>
                            </TouchableOpacity>
                            <View style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                                {item.multi.map((e:any, index:number)=>{
                                    return (<View key={index}>
                                        <Text style={{ color: colorScheme === "dark" ? 'white' : 'black' }}>{e.name}, ({e.mlData.Material})</Text>
                                    </View>)
                                })}
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </TouchableHighlight>
        )
    }

    const HiddenItemWithActions = (props: any) => {
        const { onDelete, swipeAnimatedValue, rowHeightAnimatedValue } = props


        return (<>
            <Animated.View style={[styles.rowBack, { height: rowHeightAnimatedValue }]}>
                <Text />
                <Animated.View style={[styles.backRightBtn, styles.backRightBtnRight, {
                    width: windowWidth,
                }]}>
                    <TouchableOpacity onPress={onDelete} style={[styles.backRightBtn, styles.backRightBtnRight]}>
                        <Animated.View style={[styles.trash, {
                            transform: [
                                {
                                    scale: swipeAnimatedValue.interpolate({
                                        inputRange: [-90, -45],
                                        outputRange: [1, 0],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                        }]}>
                            <MaterialCommunityIcons name="trash-can-outline" size={50} color={'white'} />
                        </Animated.View>
                    </TouchableOpacity>
                </Animated.View>

            </Animated.View>
        </>)
    }

    const renderItem = (data: any, rowMap: any) => {
        const rowHeightAnimatedValue = new Animated.Value((windowWidth / divNum) + 20)
        return (
            <VisibleItem data={data} rowHeightAnimatedValue={rowHeightAnimatedValue} removeRow={() => { deleteRow(rowMap, data.item.key) }} />
        )
    }

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

    const renderHiddenItem = (data: any, rowMap: any) => {
        const rowHeightAnimatedValue = new Animated.Value((windowWidth / divNum) + 20)

        return (
            <HiddenItemWithActions
                data={data}
                rowMap={rowMap}
                rowHeightAnimatedValue={rowHeightAnimatedValue}
                onDelete={() => deleteRow(deleteRow, data.item.key)}
            />
        )
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

    const go_to_feedback = () => {
        navigation.navigate("Auth")
    }

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
                <SwipeListView
                    data={data}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    leftOpenValue={75}
                    disableRightSwipe
                    leftActivationValue={100}
                    rightActivationValue={-200}
                    leftActionValue={0}
                    rightActionValue={-windowWidth}
                    style={{ marginVertical: 120 }}
                >
                </SwipeListView>
                <View style={{ position: 'absolute', top: flipPosition + 10, left: 20 }}>
                    <Text style={{ color: colorScheme === "dark" ? "white" : "black", fontSize: 40 }} >{data.length} Image{data.length === 1 ? "" : "s"}</Text>
                </View>
            </>)}
            <View style={{ position: 'absolute', top: flipPosition + 30, right: 20 }}>
                <TouchableOpacity onPress={go_to_feedback}>
                    <MaterialIcons name="contact-support" size={30} color={colorScheme === "dark" ? "white" : "black"} />
                </TouchableOpacity>
            </View>
        </>
        );
    }

    return <Root />

}


const styles = StyleSheet.create({
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
        flexDirection: 'row',
        width: windowWidth - 30,
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
