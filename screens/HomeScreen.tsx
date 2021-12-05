import { useState, useEffect, useContext } from 'react';
import * as React from 'react'
import { Animated, Image, StyleSheet, View, Text, Dimensions, Button } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageClassification from '../components/imageClassification';
import useColorScheme from '../hooks/useColorScheme';
import ImageContext from '../hooks/imageContext';
import { SwipeListView } from 'react-native-swipe-list-view';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { AnyIfEmpty } from 'react-redux';
const windowWidth = Dimensions.get('window').width;

export default function HomeScreen() {
    const colorScheme = useColorScheme()
    const [lenImage, setLenImage] = useState(0)
    const [data, setData] = useState([])
    const [uri, setUri] = useContext(ImageContext).uri


    const VisibleItem = (props: any) => {
        const { data } = props
        return (
            <TouchableHighlight
                underlayColor={'#aaa'}
            >
                <ImageClassification material={data.item.material} uri={data.item.uri} width={data.item.width} />
            </TouchableHighlight>
            
                
        )
    }

    const HiddenItemWithActions = (props: any) => {
        const { onClose, onDelete } = props
        return (<>
            <View>
                <Text>Left</Text>
            </View>
            
            <View style={[styles.backRightBtn, styles.backRightBtnLeft]}>
                <Button title={'Close'} onPress={onClose} />
            </View>

            <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
                <Button title={'Delete'} onPress={onDelete} />
            </View>

        </>)
    }

    const renderItem = (data: any, rowMap: any) => {
        return (
            <VisibleItem data={data} />
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

    const renderHiddenItem = (data: any, rowMap: any) => {

        return (
            <HiddenItemWithActions
                data={data}
                rowMap={rowMap}
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
                rightOpenValue={-150}
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
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        
    },
    backRightBtn: {
        alignItems: 'flex-end',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
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
