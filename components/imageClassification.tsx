import * as React from 'react'
import { Dimensions, Image, StyleSheet, Text, useColorScheme, View } from 'react-native';


const windowWidth = Dimensions.get('window').width;

const ImageClassification = ({material, uri, width}:any) => {

    const colorScheme = useColorScheme()

    const imageWidth = width < 600 ? width / 4 : width / 2
    return (
        <View style={styles.card}>
          <View style={[styles.containerTitle, {backgroundColor: colorScheme === "dark" ? '#181818' : '#fff'}]}>
            <Image source={{ uri: uri }} style={{ height: imageWidth, width: imageWidth, borderRadius: 3 }} />
            <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
              <Text style={{ fontSize: width < 600 ? 20: 40, color: colorScheme === "dark" ? 'white':'black' }}>{material}</Text>
            </View>
          </View>
      </View>
    )
}

const styles = StyleSheet.create({
  containerTitle: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    width: windowWidth - 30,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  card: {
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  }
});

export default ImageClassification