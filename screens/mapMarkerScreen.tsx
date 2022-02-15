import { Feather } from "@expo/vector-icons"
import { useIsFocused } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import { View, Text, Image, ImageBackground, StyleSheet, Dimensions, TouchableOpacity } from "react-native"
import { ActivityIndicator } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { delete_trashcan, getTrashCanImage, getUserMarkers, getUserTrashCans } from "../api/Backend"
import getEnvVars from "../environment"
import useColorScheme from "../hooks/useColorScheme"
const { STATISMAPSAPIKEY } = getEnvVars();

const MapMarkerScreen = () => {
    const isFocused = useIsFocused()
    const colorScheme = useColorScheme()
    const [data, setData] = useState([] as any)
    const [load, setLoad] = useState(false)
    const textColor = colorScheme === "dark" ? "white" : "black"
    const windowWidth = Dimensions.get('window').width;

    useEffect(() => {
        (async () => {
            setLoad(false)
            let ans = []
            const data = await getUserMarkers()
            for (let i = 0; i < data.success.length; i++) {
                const trashCan = await getUserTrashCans(data.success[i])
                const image = await getTrashCanImage(trashCan["image_id"])
                const copy = {
                    "image_url": image.success["image_url"],
                    ...trashCan
                }
                ans.push(copy)
            }
            setData(ans)
            setLoad(true)
        })();
    }, [isFocused]);
    return (
        <SafeAreaView>
            {data.map((e: any, index: number) => {
                return (
                    <View key={index} style={[styles.container, { backgroundColor: colorScheme === "dark" ? "#181818" : '#ffffff' }]}>
                        {load ?
                            <>
                                <ImageBackground style={{ width: 120, height: 140, overflow: 'hidden', borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }} source={{ uri: e["image_url"] }} >
                                    <Text style={{ color: textColor, top: 120, left: 10 }}>{e["date_taken"]}</Text>
                                </ImageBackground>
                                <Image style={{ width: 120, height: 140, borderTopRightRadius: 10, borderBottomRightRadius: 10 }} source={{uri: `https://maps.googleapis.com/maps/api/staticmap?center=${e['latitude']},${e['longitude']}&zoom=20&size=400x400&maptype=roadmap&markers=color:blue%7Clabel:S%7C${e['latitude']},${e['longitude']}&key=${STATISMAPSAPIKEY}`}}/>
                            </>
                            :
                            <ActivityIndicator style={{ width: 120, height: 140 }} size="large" color="#246EE9" />
                        }
                        <View style={{ width: windowWidth }}>
                            <TouchableOpacity
                                style={{ left: windowWidth - 390, top: 50 }}
                                onPress={async () => {
                                    await delete_trashcan(e["image_id"])
                                    let copy = []
                                    for (let i = 0; i < data.length; i++) {
                                        if (data[i]["image_id"] !== e["image_id"]) {
                                            copy.push(data[i])
                                        }
                                    }
                                    setData(copy)
                                }}
                            >
                                <Feather name="trash-2" size={30} color="#fe6f5e" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            })}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 50,
        borderRadius: 10,
        shadowColor: 'black',
        flexDirection: 'row',
        height: 140,
    }
})

export default MapMarkerScreen