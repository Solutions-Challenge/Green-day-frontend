import { useIsFocused } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import { View, Text, Image, ImageBackground } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { delete_trashcan, getTrashCanImage, getUserMarkers, getUserTrashCans } from "../api/Backend"

const MapMarkerScreen = () => {
    const isFocused = useIsFocused()
    const [data, setData] = useState([] as any)
    useEffect(() => {
        (async () => {
            let ans = []
            const data = await getUserMarkers()
            for (let i = 0; i < data.success.length; i++) {
                const trashCan = await getUserTrashCans(data.success[i])
                const image = await getTrashCanImage(trashCan["image_id"])
                const copy = {
                    "image_base64": image.success["image_base64"].substring(2),
                    ...trashCan
                }
                ans.push(copy)
            }
            setData(ans)
        })();
    }, [isFocused]);
    return (
        data.map((e:any)=>{
            return (
                <SafeAreaView>
                    <Text>{e["date_taken"]}</Text>
                    <Image style={{width: 50, height: 50}} source={{uri: `data:image/jpeg;base64,${e["image_base64"]}` }} />
                    <TouchableOpacity
                        onPress={async ()=>{
                            await delete_trashcan(e["image_id"])
                            let newData = data.filter((e:any)=>{e !== e["image_id"]})
                            setData(newData)
                        }}
                    >
                        <Text>Delete Me</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            )
        })
    )
}

export default MapMarkerScreen