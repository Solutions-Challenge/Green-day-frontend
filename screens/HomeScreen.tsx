import { useState, useEffect, useContext } from 'react';
import * as React from 'react'
import { Animated, Image, StyleSheet, View, Text, Dimensions, Button, TouchableOpacity, TouchableHighlight } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageClassification from '../components/imageClassification';
import useColorScheme from '../hooks/useColorScheme';
import ImageContext from '../hooks/imageContext';
import { SwipeListView } from 'react-native-swipe-list-view';
import { AnyIfEmpty } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const windowWidth = Dimensions.get('window').width;

export default function HomeScreen() {
    const colorScheme = useColorScheme()
    const [lenImage, setLenImage] = useState(0)
    const [data, setData] = useState([])
    const [uri, setUri] = useContext(ImageContext).uri


    const VisibleItem = (props: any) => {
        const { data, rowHeightAnimatedValue, removeRow, leftActionState, rightActionState } = props
        
        if (rightActionState) {
            Animated.timing(rowHeightAnimatedValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false
            }).start(()=>{
                removeRow()
            })
        }
        
        return (
            <TouchableHighlight
                underlayColor={'#aaa'}
            >
                <ImageClassification material={data.item.material} uri={data.item.uri} width={data.item.width} />
            </TouchableHighlight>


        )
    }

    const HiddenItemWithActions = (props: any) => {
        const { onClose, onDelete, swipeAnimatedValue, leftActionActivated, rightActionActivated, rowActionAnimatedValue, rowHeightAnimatedValue } = props
        
        if (rightActionActivated) {
            Animated.spring(rowActionAnimatedValue, {
                toValue: 500,
                useNativeDriver: false
            }).start()
        }
        
        return (<Animated.View style={[styles.rowBack, {height: rowHeightAnimatedValue}]}>
            <Text>Left</Text>

            

            <Animated.View style={[styles.backRightBtn, styles.backRightBtnRight, {
                flex: 1,
                width: rowActionAnimatedValue
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
                        <MaterialCommunityIcons name="trash-can-outline" size={25} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>

        </Animated.View>)
    }

    const renderItem = (data: any, rowMap: any) => {
        const rowHeightAnimatedValue = new Animated.Value(60)
        return (
            <VisibleItem data={data} rowHeightAnimatedValue={rowHeightAnimatedValue} removeRow={()=>{deleteRow(rowMap, data.item.key)}} />
        )
    }

    const closeRow = (rowMap: any, rowKey: any) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow()
        }
    }

    const deleteRow = async (rowMap: any, rowKey: any) => {
        closeRow(rowMap, rowKey)
        const newData = [...data]
        const prevIndex = data.findIndex((item: any) => item.key === rowKey)
        newData.splice(prevIndex, 1)
        setData(newData)
        await AsyncStorage.setItem("ImageClassify", JSON.stringify(newData.reverse()))
    }

    const onRowDidOpen = (rowKey:any) => {
        console.log('This row opened', rowKey);
    };

    const onLeftActionStatusChange = (rowKey:any) => {
        console.log('onLeftActionStatusChange', rowKey);
    };

    const onRightActionStatusChange = (rowKey:any) => {
        console.log('onRightActionStatusChange', rowKey);
    };

    const onRightAction = (rowKey:any) => {
        console.log('onRightAction', rowKey);
    };

    const onLeftAction = (rowKey:any) => {
        console.log('onLeftAction', rowKey);
    };

    const renderHiddenItem = (data: any, rowMap: any) => {
        const rowActionAnimatedValue = new Animated.Value(75)
        const rowHeightAnimatedValue = new Animated.Value(60)

        return (
            <HiddenItemWithActions
                data={data}
                rowMap={rowMap}
                rowActionAnimatedValue={rowActionAnimatedValue}
                rowHeightAnimatedValue={rowHeightAnimatedValue}
                onClose={() => closeRow(rowMap, data.item.key)}
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
                let item = JSON.parse(res as string).reverse()
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

    return (<>
        {data.length === 0 ? (
            <View style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 25, lineHeight: 40, color: colorScheme === 'dark' ? 'white' : 'black' }}>No Picture Taken</Text>
                <Image source={require("../assets/images/empty.png")} />
                <Text style={{ fontSize: 20, color: colorScheme === 'dark' ? 'white' : 'black' }}>Take a picture and see</Text>
                <Text style={{ fontSize: 20, color: colorScheme === 'dark' ? 'white' : 'black' }}>its recyclability here</Text>
            </View>
        ) : (
            <SwipeListView
                data={data}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={75}
                rightOpenValue={-75}
                disableRightSwipe
                onRowDidOpen={onRowDidOpen}
                leftActivationValue={100}
                rightActivationValue={-200}
                leftActionValue={0}
                rightActionValue={-500}
                onLeftAction={onLeftAction}
                onRightAction={onRightAction}
                onLeftActionStatusChange={onLeftActionStatusChange}
                onRightActionStatusChange={onRightActionStatusChange}
                style={{marginTop: 100}}

            >
            </SwipeListView>
        )}
    </>);
}

const styles = StyleSheet.create({
    containerTitle: {
        padding: 20,
        paddingTop: 40,
        flexDirection: 'row',
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        height: 60,
        margin: 5,
        marginBottom: 15,
        shadowColor: '#999',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    rowFrontVisible: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        height: 60,
        padding: 10,
        marginBottom: 15,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        margin: 5,
        marginBottom: 15,
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
    },
    backRightBtnLeft: {
        backgroundColor: '#1f65ff',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
    trash: {
        height: 25,
        width: 25,
        marginRight: 7,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#666',
    },
    details: {
        fontSize: 12,
        color: '#999',
    },
});
