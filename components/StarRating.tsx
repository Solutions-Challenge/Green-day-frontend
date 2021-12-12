import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useColorScheme from '../hooks/useColorScheme';

const StarRating = (props:any) => {

    // This array will contain our star tags. We will include this
    // array between the view tag.
    let stars = [];
    // Loop 5 times
    for (var i = 1; i <= 5; i++) {
        // set the path to filled stars
        let name = 'ios-star';
        // If ratings is lower, set the path to unfilled stars
        if (i > props.ratings) {
            name = 'ios-star-outline';
        }
        stars.push(name)
    }

    const colorScheme = useColorScheme()

    return (
        <View style={ styles.container }>
            {stars.map((e, index)=>{
                // @ts-ignore
                return <Ionicons name={e} size={15} style={styles.star} key={index} /> 
            })} 
            <Text style={[styles.text, {color: colorScheme === "dark" ? "white":"black"}]}>({props.reviews})</Text>
        </View>
    );
	
}

export default StarRating;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	star: {
		color: '#FF8C00'
	},
	text: {
		fontSize: 12,
        marginLeft: 5,
        color: '#444',
	}
});