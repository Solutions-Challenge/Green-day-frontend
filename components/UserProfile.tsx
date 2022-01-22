import { Feather, Ionicons, Zocial } from "@expo/vector-icons"
import React from "react"
import { ImageBackground, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

const UserProfile = ({ uri, navigation }: any) => {
    return (
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <TouchableOpacity onPress={() => {
                navigation.navigate("Pic", { purpose: "update user picture" })
            }}> 
                <ImageBackground
                    source={{
                        uri: uri,
                    }}
                    style={{ width: 120, height: 120, borderRadius: 60, overflow: 'hidden', borderColor: "black", borderWidth: uri==="guest" ? 2:0 }}
                    resizeMode="cover"
                >
                    {uri==="guest" && <Ionicons name="person-sharp" color="black" size={120} style={{marginLeft: 2}} />}

                    <View style={{ marginTop: 'auto', height: 35, backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center' }}>
                        <Feather name="camera" size={27} color="white" />
                    </View>
                </ImageBackground>

            </TouchableOpacity>
        </View>
    )
}

export default UserProfile