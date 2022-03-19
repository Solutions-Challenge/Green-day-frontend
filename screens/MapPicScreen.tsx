import { useNavigation, useRoute } from "@react-navigation/native"
import React from "react"
import { Text, Dimensions, Linking, ImageBackground, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoBack } from "../components/goBack";

const MapPicScreen = () => {
    const route = useRoute()
    const navigation = useNavigation()
    const { width, height } = Dimensions.get("window");

    const { pic, lat, lng }: any = route.params

    return (
        <SafeAreaView>
            <ImageBackground source={{ uri: pic }} style={{ height: height, width: width }} >
                <View style={{marginTop: height - 100, marginLeft: 20}}>                    
                    <TouchableOpacity onPress={() => { Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`); navigation.goBack()  }}>
                        <View style={{
                            backgroundColor: '#246EE9', 
                            borderRadius: 10,
                            height: 45,
                            width: 100,
                        }}>
                            <Text style={{alignSelf: 'center', marginTop: 'auto', marginBottom: 'auto', color: 'white'}}>Go Here</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </ ImageBackground>
            <GoBack />
        </SafeAreaView>
    )
}

export default MapPicScreen