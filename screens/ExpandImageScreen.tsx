import { osName } from 'expo-device';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, StatusBar, Text, TouchableOpacity, View, Image, Animated, StyleSheet, ActivityIndicator, ListRenderItem } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { predict } from '../api/Backend';
import useColorScheme from '../hooks/useColorScheme';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const ExpandImageScreen = ({ navigation, item }: any) => {
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
    const [index, setIndex] = useState(0)
    const _scrollView = useRef<any>(null)

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 70, minimumViewTime: 100, })
    let onViewableItemsChanged = useRef(({ changed }: any) => {
        setIndex(changed[0].key);
    })

    const scrollX = new Animated.Value(0)
    let position = Animated.divide(scrollX, windowWidth)


    const goBack = (name: string) => {
        navigation.navigate('Maps', {
            material: name
        })
    }

    useEffect(() => {
        (async () => {
            if (!ifMLData[0]) {
                let formData = new FormData();
                let temp = 0

                console.log(item)

                let object
                for (let i = 0; i < item.multi.length; i++) {
                    object = item.multi[i]

                    const croppedImage = await manipulateAsync(
                        item.image.uri,
                        [{
                            resize: {
                                width: windowWidth,
                                height: windowWidth
                            }
                        },
                        {
                            crop: {
                                originX: windowWidth * object.boundingPoly.normalizedVertices[0].x || 0,
                                originY: windowWidth * object.boundingPoly.normalizedVertices[0].y || 0,
                                width: (windowWidth * object.boundingPoly.normalizedVertices[2].x || 0) - (windowWidth * object.boundingPoly.normalizedVertices[0].x || 0),
                                height: (windowWidth * object.boundingPoly.normalizedVertices[2].y || 0) - (windowWidth * object.boundingPoly.normalizedVertices[0].y || 0)
                            }
                        }
                        ],
                        {
                            format: 'jpeg' as SaveFormat,
                            compress: 0.3,
                        }
                    )
                    object.croppedImage = croppedImage.uri
                }

                for (let i = 0; i < item.multi.length; i++) {
                    let filename = item.multi[i].croppedImage.split('/').pop();
                    let match = /\.(\w+)$/.exec(filename as string);
                    let type = match ? `image/${match[1]}` : `image`;
                    // @ts-ignore
                    formData.append('files[]', { uri: item.multi[i].croppedImage, name: filename, type });
                    
                    if (temp == 2 || i + 1 == item.multi.length) {
                        const MLdata:any = await predict(formData)

                        let ifmlCopy = [...ifMLData]
                        for (let j = temp; j >= 0; j--) {
                            item.multi[i - j].mlData = MLdata.success[j]
                            for (let k = 0; k < item.multi[i - j].mlData.length; k++) {
                                item.multi[i - j].mlData[k].position = i - j
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

    const renderItem: ListRenderItem<any> = useCallback(({ item }) => {
        return (
            <View style={styles.cardView}>
                {"croppedImage" in item && <Image style={styles.image} source={{ uri: item.croppedImage }} />}
                <View style={styles.textView}>
                    <Text style={styles.itemTitle}>{item.name}</Text>
                </View>
            </View>
        )
    }, [ifMLData])

    useEffect(() => {
        if (ifMLData[index]) {
            _scrollView?.current?.scrollToIndex({ index: 0, animated: true, viewOffset: 0.5 })
        }
    }, [index])

    const chipItem: ListRenderItem<any> = useCallback(({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    let catCopy = [...catIndex]
                    catCopy[item.position] = index
                    setCatIndex(catCopy)
                }}
                key={index}
                style={[styles.chipsItem, { backgroundColor: index === catIndex[item.position] ? "#ADD8E6" : "white", marginTop: 20, marginLeft: 5, marginRight: 5 }]}>
                <Text>{item.Material}</Text>
            </TouchableOpacity>

        )
    }, [ifMLData, catIndex])



    return (
        <View style={{ backgroundColor: colorScheme === "dark" ? '#181818' : "white", height: windowHeight, display: 'flex' }}>
            <FlatList
                onViewableItemsChanged={onViewableItemsChanged.current}
                viewabilityConfig={viewConfigRef.current}
                data={item.multi}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                horizontal
                pagingEnabled
                scrollEnabled
                snapToAlignment='center'
                scrollEventThrottle={16}
                decelerationRate={'fast'}
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
            />

            <View style={{ position: 'absolute', top: windowHeight / 4 + 20, alignSelf: 'center', flexDirection: 'row' }}>
                {item.multi.map((_: any, i: any) => {
                    let opacity = position.interpolate({
                        inputRange: [i - 1, i, i + 1],
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp'
                    })

                    return (<>
                        <Animated.View
                            key={i}
                            style={{ opacity, height: 10, width: 10, backgroundColor: '#595959', margin: 8, borderRadius: 5 }}
                        />
                    </>)
                })}
            </View>

            <View style={{ position: 'absolute', top: windowHeight / 4 + 40, flexDirection: 'row' }}>

                {ifMLData[index] ?
                    <View>
                        <FlatList
                            horizontal
                            ref={_scrollView}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingRight: 20
                            }}
                            data={item.multi[index].mlData}
                            renderItem={chipItem}
                            keyExtractor={keyExtractor}
                        />

                        <TouchableOpacity
                            onPress={() => {
                                goBack(item.multi[index].mlData[catIndex[index]].mapData.name)
                            }}
                            style={[styles.chipsItem, { backgroundColor: "white", marginTop: 20, height: 60, width: 170, marginLeft: windowWidth / 2 - 170 / 2, paddingLeft: 30 }]}>
                            <Image source={{ uri: item.multi[index].mlData[catIndex[index]].mapData.icon }} style={{ width: 40, height: 40, marginRight: 15, marginTop: 'auto', marginBottom: 'auto' }} />
                            <Text style={{ marginTop: 'auto', marginBottom: "auto", width: 130 }}>{item.multi[index].mlData[catIndex[index]].mapData.name}</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <ActivityIndicator style={{ marginLeft: windowWidth / 2 - 18, marginTop: 30 }} size="large" color="#246EE9" />

                }
            </View >
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
    cardView: {
        flex: 1,
        width: windowWidth - 20,
        height: windowHeight / 4,
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 10,
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 5
    },
    textView: {
        position: 'absolute',
        bottom: 10,
        margin: 10,
        left: 5
    },
    image: {
        width: windowWidth - 20,
        borderRadius: 10,
        flex: 1,
        resizeMode: 'cover'
    },
    itemTitle: {
        color: 'white',
        fontSize: 22,
        shadowColor: '#000',
        shadowOffset: { width: 0.8, height: 0.8 },
        shadowOpacity: 1,
        shadowRadius: 3,
        marginBottom: 5,
        fontWeight: 'bold',
        elevation: 5
    },
    itemDescription: {
        color: 'white',
        fontSize: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0.8, height: 0.8 },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 5
    }
})

export default ExpandImageScreen