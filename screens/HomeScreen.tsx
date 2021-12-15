import { useState, useEffect, useContext } from 'react';
import * as React from 'react'
import { Animated, Image, StyleSheet, View, Text, Dimensions, TouchableOpacity, TouchableHighlight, StatusBar } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import useColorScheme from '../hooks/useColorScheme';
import ImageContext from '../hooks/imageContext';
import { SwipeListView } from 'react-native-swipe-list-view';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { osName } from 'expo-device';
import read_data from '../api/firebase';

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

        const imageWidth = data.item.width < 600 ? data.item.width / 4 : data.item.width / 3
        const item = data.item

        return (
            <TouchableHighlight style={{ marginBottom: 50 }}>
                {/* @ts-ignore */}
                <Animated.View style={{ height: rowHeightAnimatedValue }}>
                    <View style={styles.card}>
                        <View style={[styles.containerTitle2, { backgroundColor: colorScheme === "dark" ? '#181818' : '#fff' }]}>
                            <TouchableOpacity activeOpacity={1} style={{ paddingBottom: data.item.width < 600 ? 30 : 0 }} onPress={() => { navigation.push('Details', { item }) }}>
                                <Image
                                    source={{ uri: item.uri }}
                                    style={{
                                        height: imageWidth,
                                        width: imageWidth,
                                        borderRadius: 10
                                    }} />
                            </TouchableOpacity>
                            <View style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                                <Text style={{ fontSize: item.width < 600 ? 20 : 40, color: colorScheme === "dark" ? 'white' : 'black' }}>{item.material}</Text>
                                <TouchableOpacity style={styles.recycleButton} onPress={() => { navigation.push('Details', { item }) }}>
                                    <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: 'white', paddingRight: 10 }}>{item.recyclability}</Text>
                                        <AntDesign name="downcircleo" size={16} color="white" />
                                    </View>
                                </TouchableOpacity>
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

    const closeRow = (rowMap:any, rowKey:any) => {
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
        await AsyncStorage.setItem("ImageClassify", JSON.stringify(newData))
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

        let ImageClassify = await AsyncStorage.getItem("ImageClassify")
        if (ImageClassify === null) {
            await AsyncStorage.setItem("ImageClassify", JSON.stringify(data))
        }
        await AsyncStorage.getItem("ImageClassify")
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
        navigation.navigate("FeedBack")
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
                    style={{ marginVertical: 100 }}
                >
                </SwipeListView>
                <View style={{ position: 'absolute', top: flipPosition + 10, left: 20 }}>
                    <Text style={{ color: colorScheme === "dark" ? "white" : "black", fontSize: 40 }} >{data.length} Image{data.length === 1 ? "" : "s"}</Text>
                </View>
            </>)}
            <View style={{ position: 'absolute', top: flipPosition + 30, right: 20 }}>
                <TouchableOpacity onPress={()=>read_data()}>
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
    recycleButton: {
        backgroundColor: "#190c8d",
        fontSize: 20,
        fontWeight: "600",
        borderRadius: 50,
        height: 50,
        width: 200,
        paddingHorizontal: 10,
        marginTop: 'auto'
    }
});
