import React from "react"
import { TouchableOpacity, Text, View, Image } from "react-native"


const AuthButton = ({ uri, text, funct }: any) => {
    return (
        <TouchableOpacity onPress={() => { funct() }} style={{ marginBottom: 20 }} >
            <View style={{
                height: 60,
                flexDirection: 'row',
                paddingHorizontal: 20,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                backgroundColor: '#fff',
                shadowColor: "#000",
                shadowRadius: 5,
                shadowOpacity: 0.3,
                shadowOffset: { width: 2, height: -2 },
                elevation: 5
            }}>
                <Image
                    source={{
                        uri: uri,
                    }}
                    style={{ width: 40, height: 40 }}
                />
                <Text style={{ textAlignVertical: 'center', marginLeft: 20, color: "#757575", fontSize: 14, fontWeight: "500" }}>{text}</Text>

            </View>
        </TouchableOpacity>
    )
}

export default AuthButton