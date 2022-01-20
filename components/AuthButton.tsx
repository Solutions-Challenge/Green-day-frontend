import React from "react"
import { TouchableOpacity, Text } from "react-native"
import { Box, Image, AspectRatio } from 'native-base';


const AuthButton = ({ uri, text, funct }:any) => {
    return (
        <TouchableOpacity onPress={() => { funct() }} style={{marginBottom: 20}} >

            <Box
                style={{ height: 60, flexDirection: 'row', paddingHorizontal: 20, justifyContent: 'center' }}
                shadow={3}
                _light={{
                    backgroundColor: "gray.50",
                }}
                _dark={{
                    backgroundColor: "gray.700",
                }}
            >
                <AspectRatio ratio={1 / 1}>
                    <Image
                        roundedTop="lg"
                        size="sm"
                        source={{
                            uri: uri,
                        }}
                        alt="image"
                    />
                </AspectRatio>
                <Text style={{ textAlignVertical: 'center', marginLeft: 20, color: "#757575", fontSize: 14, fontWeight: "500" }}>{text}</Text>
            </Box>
        </TouchableOpacity>
    )
}

export default AuthButton