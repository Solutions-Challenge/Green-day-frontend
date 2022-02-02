import { Feather, Ionicons, Zocial } from "@expo/vector-icons"
import React from "react"
import { ImageBackground, useColorScheme, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

const UserProfile = ({ uri, navigation, hideCameraEdit, width, height }: any) => {
    const colorScheme = useColorScheme();
    return (
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <TouchableOpacity onPress={() => {
                if (!hideCameraEdit) {
                    navigation.navigate("Pic", { purpose: "update user picture" })
                }
            }}>
                <ImageBackground
                    source={{
                        uri: uri,
                    }}
                    style={{ width: width ? width:120, height: height?height:120, borderRadius: width?width/2:60, overflow: 'hidden', borderColor: "black", borderWidth: uri === "Guest" ? 1 : 0 }}
                    resizeMode="cover"
                >
                    {(uri === "guest" || uri==="Guest") && <Ionicons name="person-sharp" color={colorScheme === "dark" ? "white" : "black"} size={width?width:130} style={{alignSelf: 'center', marginTop: 5}} />}

                    {
                        !hideCameraEdit &&
                        <View style={{ marginTop: 'auto', height: 35, backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center' }}>
                            <Feather name="camera" size={27} color="white" />
                        </View>
                    }
                </ImageBackground>

            </TouchableOpacity>
        </View>
    )
}

export default UserProfile