import { Feather, Ionicons, Zocial } from "@expo/vector-icons"
import React, { useContext, useState } from "react"
import { ImageBackground, useColorScheme, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { updateUri } from "../api/Auth";
import ImageContext from "../hooks/imageContext";

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const UserProfile = ({ hideCameraEdit, width, height }: any) => {
    const [profileUri, setProfileUri] = useContext(ImageContext).profileUri

    return (
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <TouchableOpacity onPress={async () => {
                if (!hideCameraEdit) {
                    setProfileUri(uuid())
                    await updateUri(`https://avatars.dicebear.com/api/avataaars/:${profileUri}.png`)
                }
            }}>
                <ImageBackground
                    source={{
                        uri: profileUri === "Guest" ? "":`https://avatars.dicebear.com/api/avataaars/:${profileUri}.png`,
                    }}
                    style={{ width: width ? width : 120, height: height ? height : 120, borderRadius: width ? width / 2 : 60, overflow: 'hidden', borderColor: "black", borderWidth: profileUri === "Guest" ? 1 : 0, backgroundColor: 'white' }}
                    resizeMode="cover"
                >
                    {(profileUri === "Guest") && <Ionicons name="person-sharp" color={"black"} size={width ? width : 130} style={{ alignSelf: 'center', marginTop: 5 }} />}

                    {
                        !hideCameraEdit &&
                        <View style={{ marginTop: 'auto', height: 35, backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center' }}>
                            <Ionicons name="reload" size={30} color="white" />
                        </View>
                    }
                </ImageBackground>

            </TouchableOpacity>
        </View>
    )
}

export default UserProfile