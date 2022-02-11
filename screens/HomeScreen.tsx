import { useState, useEffect, useContext, useCallback, useRef, createRef } from 'react';
import * as React from 'react'
import { Animated, Image, StyleSheet, View, Text, Dimensions, TouchableOpacity, TouchableHighlight, StatusBar, ImageBackground, FlatList, TouchableWithoutFeedback, ScrollView, Modal, RefreshControl } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage';
import useColorScheme from '../hooks/useColorScheme';
import ImageContext from '../hooks/imageContext';
import { osName } from 'expo-device';

import Svg, { Rect } from 'react-native-svg';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import ExpandImageScreen from './ExpandImageScreen';
import UserProfile from '../components/UserProfile';
import { auth, currentUser, logout } from '../api/Auth';
import { onAuthStateChanged, User } from 'firebase/auth';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const divNum = windowWidth < 600 ? 4 : 3

let flipPosition: any = osName === "Android" ? StatusBar.currentHeight as number : 30


const wait = (timeout: any) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function HomeScreen({ navigation }: any) {
    const deletePic = async (photo_id: string) => {
        if (authChange) {

            const id_token = await currentUser().getIdToken()

            let details = {
                id_token: id_token,
                photo_id: photo_id,
                meta_flag: "true"
            } as any

            let formBody = []
            for (let props in details) {
                let encodedKey = encodeURIComponent(props)
                let encodedVal = encodeURIComponent(details[props])
                formBody.push(encodedKey + "=" + encodedVal)
            }
            formBody = formBody.join("&") as any
            const data = await fetch("http://100.64.58.72:8080/database/deletePic", {
                method: 'DELETE',
                body: formBody,
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            })
        }
    }

    const getPic = async (photo_id: string) => {
        if (authChange) {

            const id_token = await currentUser().getIdToken()

            let details = {
                id_token: id_token,
                photo_id: photo_id,
                meta_flag: "true"
            } as any

            let formBody = []
            for (let props in details) {
                let encodedKey = encodeURIComponent(props)
                let encodedVal = encodeURIComponent(details[props])
                formBody.push(encodedKey + "=" + encodedVal)
            }
            formBody = formBody.join("&") as any
            const data = await fetch("http://100.64.58.72:8080/database/getPic", {
                method: 'POST',
                body: formBody,
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            })

            let json = await data.json()

            json.success.photo.uri = json.success.photo.uri.substring(2)

            json.success["photo-meta"].image = json.success.photo

            return json.success["photo-meta"]
        }
    }

    const getAllPics = async () => {
        if (authChange) {
            const id_token = await currentUser().getIdToken()

            let details = {
                id_token: id_token
            } as any

            let formBody = []
            for (let props in details) {
                let encodedKey = encodeURIComponent(props)
                let encodedVal = encodeURIComponent(details[props])
                formBody.push(encodedKey + "=" + encodedVal)
            }
            formBody = formBody.join("&") as any
            const data = await fetch("http://100.64.58.72:8080/database/getPicKeys", {
                method: 'POST',
                body: formBody,
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            })

            const json = await data.json()

            return json
        }
    }
    const colorScheme = useColorScheme()
    const [data, setData] = useState([])
    const [uri, setUri] = useContext(ImageContext).uri
    const [imageWidth,] = useState(windowWidth / 1.5)
    const [itemData, setItemData] = useState(null)
    const [profileUri, setProfileUri] = useContext(ImageContext).profileUri
    const [, setFullName] = useContext(ImageContext).fullName
    const [authChange, setAuthChange] = useState(false)

    const [refreshing, setRefreshing] = React.useState(false);

    const [checked, setChecked] = useState([false])
    const [onLongPress, setOnLongPress] = useState(false)
    const bs = useRef<BottomSheet>(null)
    const _scrollView = useRef<FlatList>(null)
    const [fireStorePics, setFireStorePics] = useState([])

    const onLongPressIn = () => {
        setOnLongPress(true)
    }

    const changeChecked = (index: number) => {
        let checkedCopy = checked
        checkedCopy[index] = !checkedCopy[index]
        setChecked(checkedCopy)
    }

    const reload = async () => {
        if (authChange) {
            const ids = await getAllPics()
            setRefreshing(true)
            setFireStorePics(ids.success)
            let currentPhotos = []
            if (fireStorePics !== []) {
                for (let i = 0; i < data.length; i++) {
                    // @ts-ignore
                    currentPhotos.push(data[i].key)
                }

                const setA = new Set(fireStorePics)
                const setB = new Set(currentPhotos)

                let _difference = new Set(setA)
                for (let elem of setB) {
                    // @ts-ignore
                    _difference.delete(elem)
                }

                if (authChange) {
                    let ans: any[] = []
                    let check = false
                    _difference.forEach(async (e) => {
                        await getPic(e)
                            .then((res) => {
                                ans.push(res)
                                if (ans.length === _difference.size) {
                                    ans.push(...data)
                                    check = true
                                }
                            })

                        if (check) {
                            await AsyncStorage.setItem("multi", JSON.stringify(ans))
                                .then(() => {
                                    setRefreshing(false)
                                })
                            // @ts-ignore
                            setData(ans)
                        }
                    })
                }

                setRefreshing(false)

                let _difference2 = new Set(setB)
                for (let elem of setA) {
                    // @ts-ignore
                    _difference2.delete(elem)
                }

                if (authChange) {
                    let ans: any[] = []
                    _difference2.forEach(async (e) => {
                        ans.push(e)
                    })
                    let indices = []
                    for (let i = 0; i < data.length; i++) {
                        for (let j = 0; j < ans.length; j++) {
                            // @ts-ignore
                            if (data[i].key === ans[j]) {
                                if (!(i in indices)) {
                                    indices.push(i)
                                }
                            }
                        }
                    }
                    console.log(indices)
                    deleteRow(indices)
                }
            }


        }

    }

    useEffect(() => {
        reload()
    }, [authChange]);

    useEffect(() => {
        (async () => {
            let data: any = await AsyncStorage.getItem("remember")
            const remember = JSON.parse(data) as any
            await onAuthStateChanged(auth, async (user) => {
                const d = await user?.getIdToken()
                console.log(d)
                setAuthChange(true)
                if (user !== null && remember.remember) {
                    setProfileUri(user.photoURL || "Guest")
                    setFullName(user.displayName || "Guest")
                }
                else {
                    setProfileUri("Guest")
                    setFullName("")
                    await logout()
                }
            })
        })();
    }, []);

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
                                    source={{ uri: "data:image/jpeg;base64," + item.image.uri }}
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

        for (let i = 0; i < indices.length; i++) {
            // @ts-ignore
            deletePic(data[i].key)
        }

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
        let ImageClassify: any = await AsyncStorage.getItem("multi")
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
                snapPoints={[windowHeight / 1.3, 0]}
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
                <ScrollView
                    style={{ display: 'flex', flex: 1, marginTop: windowHeight / 2 - 200 }}
                    refreshControl={
                        <RefreshControl
                            enabled={true}
                            refreshing={refreshing}
                            onRefresh={useCallback(() => {
                                reload()
                            }, [])}
                        />
                    }
                    contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
                    >
                    <View>
                        <Text style={{ fontSize: 25, lineHeight: 40, color: colorScheme === 'dark' ? 'white' : 'black', alignSelf: 'center' }}>No Picture Taken</Text>
                        <Image source={require("../assets/images/empty.png")} />
                        <Text style={{ fontSize: 20, color: colorScheme === 'dark' ? 'white' : 'black', alignSelf: 'center' }}>Take a picture and see</Text>
                        <Text style={{ fontSize: 20, color: colorScheme === 'dark' ? 'white' : 'black', alignSelf: 'center' }}>its recyclability here</Text>
                    </View>
                </ScrollView>
            </>) : (<>
                <FlatList
                    data={data}
                    extraData={checked}
                    refreshControl={
                        <RefreshControl
                            enabled={true}
                            refreshing={refreshing}
                            onRefresh={React.useCallback(() => {
                                reload()
                            }, [])}
                        />
                    }
                    ref={_scrollView}
                    onScrollToIndexFailed={(err) => { console.log(err) }}
                    keyExtractor={(item,) => item.key}
                    renderItem={renderItem}
                    style={{ marginVertical: 120 }}
                />


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
                    </View>
                }
                <View style={{ position: 'absolute', top: flipPosition + 10, right: 20 }}>
                    <Text style={{ color: colorScheme === "dark" ? "white" : "black", fontSize: 40 }} >{data.length} Image{data.length === 1 ? "" : "s"}</Text>
                </View>
            </>)}
            <TouchableOpacity onPress={() => { navigation.openDrawer() }} style={{ position: 'absolute', top: flipPosition, left: 20 }}>
                <UserProfile uri={profileUri} navigation={navigation} hideCameraEdit={true} width={40} height={40} />
            </TouchableOpacity>

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