import { useState, useEffect, useContext } from 'react';
import * as React from 'react'
import { Animated, Image, StyleSheet, View, Text, Dimensions, Button, TouchableOpacity, TouchableHighlight, StatusBar } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageClassification from '../components/imageClassification';
import useColorScheme from '../hooks/useColorScheme';
import ImageContext from '../hooks/imageContext';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { osName } from 'expo-device';
const windowWidth = Dimensions.get('window').width;

const divNum = windowWidth < 600 ? 4 : 2

let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30


export default function HomeScreen({ navigation }: any) {
    const colorScheme = useColorScheme()
    const [lenImage, setLenImage] = useState(0)
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

        return (
                <TouchableHighlight style={{marginBottom: 50}}>
                    <Animated.View style={{ height: rowHeightAnimatedValue }}>
                        <ImageClassification material={data.item.material} uri={data.item.uri} width={data.item.width} />
                    </Animated.View>
                </TouchableHighlight>

        )
    }

    const HiddenItemWithActions = (props: any) => {
        const { onDelete, swipeAnimatedValue, rightActionActivated, rowActionAnimatedValue, rowHeightAnimatedValue } = props

        if (rightActionActivated) {
            Animated.spring(rowActionAnimatedValue, {
                toValue: 500,
                useNativeDriver: false
            }).start();
        } else {
            Animated.spring(rowActionAnimatedValue, {
                toValue: 75,
                useNativeDriver: false
            }).start();
        }

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
                            <MaterialCommunityIcons name="trash-can-outline" size={25} color={'white'} />
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

    const deleteRow = async (rowMap: any, rowKey: any) => {
        const newData = [...data]
        const prevIndex = data.findIndex((item: any) => item.key === rowKey)
        newData.splice(prevIndex, 1)
        setData(newData)
        await AsyncStorage.setItem("ImageClassify", JSON.stringify(newData))
    }

    const renderHiddenItem = (data: any, rowMap: any) => {
        const rowActionAnimatedValue = new Animated.Value(70)
        const rowHeightAnimatedValue = new Animated.Value((windowWidth / divNum) + 20)

        return (
            <HiddenItemWithActions
                data={data}
                rowMap={rowMap}
                rowActionAnimatedValue={rowActionAnimatedValue}
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
                <Text style={{color: 'white', fontSize: 40}} >{data.length} Image{data.length === 1 ? "":"s"}</Text>
            </View>
        </>)}
        <View style={{ position: 'absolute', top: flipPosition + 30, right: 20 }}>
            <TouchableOpacity onPress={go_to_feedback}>
                <MaterialIcons name="contact-support" size={30} color={colorScheme === "dark" ? "white" : "black"} />
            </TouchableOpacity>
        </View>
    </>);
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
        paddingRight: 17,
        marginRight: 30
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
        height: (windowWidth / divNum) + 20,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    trash: {
        height: 25,
        width: 25,
        marginRight: 7,
    },
});
