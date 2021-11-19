import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from 'react'
import { StyleSheet } from "react-native";

export default categories = [
    {
        name: "Wood",
        icon: <MaterialCommunityIcons name="food-fork-drink" size={18} />
    },
    {
        name: "Metal",
        icon: <MaterialCommunityIcons name="food-fork-drink" style={styles.chipsItem} size={18} />
    },
    {
        name: "Plastic",
        icon: <MaterialCommunityIcons name="food-fork-drink" size={18} />
    },
    {
        name: "Food",
        icon: <MaterialCommunityIcons name="food-fork-drink" size={18} />
    },
]

const styles = StyleSheet.create({
    chipsItem: {
        flexDirection:"row",
        backgroundColor:'#fff', 
        borderRadius:20,
        padding:8,
        paddingHorizontal:20, 
        marginHorizontal:10,
        height:35,
        shadowColor: '#ccc',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
      }
})