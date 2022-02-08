import { useRoute } from "@react-navigation/native"
import React from "react"
import { Text, Dimensions, Linking, ImageBackground, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from 'react-native-safe-area-context';

const MapPicScreen = () => {
    const route = useRoute()
    const { width, height } = Dimensions.get("window");

    const { pic, lat, lng }: any = route.params

    return (
        <SafeAreaView>
            <ImageBackground source={{ uri: pic }} style={{ height: height, width: width }} >
                <TouchableOpacity style={{marginTop: height - 100, marginLeft: 20}} onPress={() => { Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`) }}>
                    <View style={{
                        backgroundColor: '#246EE9', 
                        borderRadius: 10,
                        height: 45,
                        width: 100,
                    }}>
                        <Text style={{alignSelf: 'center', marginTop: 'auto', marginBottom: 'auto', color: 'white'}}>Go Here</Text>
                    </View>
                </TouchableOpacity>

            </ ImageBackground>
        </SafeAreaView>
    )
}

export default MapPicScreen