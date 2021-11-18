import React, { useEffect } from 'react'
import { View } from '../components/Themed'

const MoveToMapScreen = ({navigation}:any) => {
    return (
        <View>
            {navigation.navigate('Maps')}
        </View>
    )
}

export default MoveToMapScreen