import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import * as React from 'react'
import { Animated, Image, StyleSheet, View, Text, Dimensions, TouchableOpacity, TouchableHighlight, StatusBar, ImageBackground, FlatList } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage';
import useColorScheme from '../hooks/useColorScheme';
import ImageContext from '../hooks/imageContext';
import { osName } from 'expo-device';

import Svg, { Rect } from 'react-native-svg';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import ExpandImageScreen from './ExpandImageScreen';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const divNum = windowWidth < 600 ? 4 : 3

let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30


export default function HomeScreen({ navigation }: any) {
    const colorScheme = useColorScheme()
    const [data, setData] = useState([])
    const [uri, setUri] = useContext(ImageContext).uri
    const [imageWidth, setImageWidth] = useState(windowWidth / 1.5)
    const [itemData, setItemData] = useState(null)

    const [checked, setChecked] = useState([false])
    const [onLongPress, setOnLongPress] = useState(false)
    const bs = useRef<BottomSheet>(null)
    const _scrollView = useRef<FlatList>(null)

    const onLongPressIn = () => {
        setOnLongPress(true)
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

                {onLongPress && <BouncyCheckbox
                    useNativeDriver={true}
                    isChecked={checked[data.index]}
                    fillColor="#246EE9"
                    onPress={() => { changeChecked(data.index) }}
                />}

                <TouchableHighlight style={{ marginBottom: 50 }}>
                    {/* @ts-ignore */}
                    <View style={[styles.card, { height: imageWidth }]}>
                        <View>
                            <TouchableOpacity
                                activeOpacity={1}
                                onLongPress={() => onLongPressIn()}
                                onPress={() => {
                                    setItemData(item)
                                    setTimeout(() => {
                                        bs?.current?.snapTo(0)
                                        _scrollView.current?.scrollToIndex({ index: data.index, animated: false, viewPosition: 0 })
                                    }, 200)
                                }}
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
    }, [checked, onLongPress])

    useEffect(() => {
        setChecked(Array(data.length).fill(false))
    }, [data])

    const deleteRow = async (indices: number[]) => {
        let newData = [...data]

        let ans: any = []
        let temp = 0

        for (let i = 0; i < newData.length; i++) {
            if (indices[temp] === i) {
                temp += 1
            }
            else {
                ans.push(newData[i])
            }
        }
        setData(ans)
        await AsyncStorage.setItem("multi", JSON.stringify(ans))
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

    const renderHeader = () => (
        <View style={[styles.header, { backgroundColor: colorScheme === "dark" ? '#181818' : "white" }]}>
            <View style={styles.panelHeader}>
                <View style={[styles.panelHandle, { backgroundColor: colorScheme === "dark" ? "white" : '#00000040' }]} />
            </View>
        </View>
    )

    const Root = () => {
        return (<>
            <BottomSheet
                ref={bs}
                snapPoints={[windowHeight / 1.5, 0]}
                initialSnap={1}
                renderContent={() => {
                    return (
                        itemData && <ExpandImageScreen navigation={navigation} item={itemData} />
                    )
                }}
                renderHeader={renderHeader}
                enabledGestureInteraction={true}
                enabledInnerScrolling={false}
                enabledContentGestureInteraction={false}
            />
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
                    ref={_scrollView}
                    onScrollToIndexFailed={(err)=>{console.log(err)}}
                    // viewabilityConfig={viewConfigRef.current}
                    // onViewableItemsChanged={onViewableItemsChanged.current}
                    // @ts-ignore
                    keyExtractor={(item, index) => item.key}
                    renderItem={renderItem}
                    style={{ marginVertical: 120 }}
                />
                <View style={{ position: 'absolute', top: flipPosition + 10, left: 20 }}>
                    <Text style={{ color: colorScheme === "dark" ? "white" : "black", fontSize: 40 }} >{data.length} Image{data.length === 1 ? "" : "s"}</Text>
                </View>

                {onLongPress &&
                    <View style={{ marginLeft: 'auto', marginRight: 'auto', bottom: 130, backgroundColor: colorScheme === "dark" ? '#181818' : "white", padding: 20, borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setChecked(new Array(11).fill(false))
                                    setOnLongPress(false)
                                }}
                            >
                                <View
                                    style={[styles.button, { paddingHorizontal: 5, paddingVertical: 10, width: 150, borderWidth: 1, backgroundColor: 'transparent', borderColor: '#AAAFB4', marginRight: 5 }]}
                                >
                                    <Text style={{ color: '#AAAFB4', fontSize: 20 }}>Cancel</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    let indicesToRemove = []
                                    for (let i = 0; i < checked.length; i++) {
                                        if (checked[i]) {
                                            indicesToRemove.push(i)
                                        }
                                    }
                                    deleteRow(indicesToRemove)
                                    setOnLongPress(false)
                                }}
                            >
                                <View
                                    style={[styles.button, { paddingHorizontal: 5, paddingVertical: 10, width: 150, backgroundColor: '#F07470', marginLeft: 5 }]}
                                >
                                    <Text style={{ color: 'white', fontSize: 20 }}>DELETE</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>}
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
    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: { width: -1, height: -3 },
        shadowRadius: 2,
        shadowOpacity: 0.4,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
});
