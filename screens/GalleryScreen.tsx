import { useState, useContext, useEffect } from 'react';
import * as React from 'react'
import { Animated, Button, Dimensions, Image, Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageClassification from '../components/imageClassification';
import { useFocusEffect } from '@react-navigation/core';

export default function GalleryScreen() {
    const [data, setData] = useState([{ material: '', width: 0, uri: '' }])

    const load = async () => {
        try {
            let ImageClassify = await AsyncStorage.getItem("ImageClassify")
            if (ImageClassify != null) {
                let d = JSON.parse(ImageClassify).reverse()
                
                setData(d)
                
                return () => {
                    setData(d)
                }
            }
        }
        catch (err) {
            alert(err)
        }
    }

    useFocusEffect(() => {
        (async () => {
            load()
        })();
    });

    return (<>
        {data[0].uri === "" ? (
            <View style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 25, lineHeight: 40 }}>No Picture Taken</Text>
                <Image source={require("../assets/images/empty.png")} />
                <Text style={{ fontSize: 20 }}>Take a picture and see</Text>
                <Text style={{ fontSize: 20 }}>its recyclability here</Text>
            </View>
        ) : (
            <Animated.ScrollView
                contentContainerStyle={{
                    paddingVertical: 150
                }}
            >

                {data.map((e, index) => {
                    return (
                        <ImageClassification key={index} material={e.material} uri={e.uri} width={e.width} />
                    )
                })}
            </Animated.ScrollView>
        )}
    </>);
}

const styles = StyleSheet.create({
    containerTitle: {
        padding: 20,
        paddingTop: 40,
        flexDirection: 'row',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    category: {
        width: 45,
        height: 45,
        backgroundColor: 'white',
        borderRadius: 3
    }
});
