import React, { useCallback } from "react";
import { FlatList, ScrollView, Text, StyleSheet, View } from "react-native";

const HorizontalScroll = ({ data, numColumns, maxWidth }: any) => {
  const keyExtractor = useCallback((item, index) => index.toString(), [data]);
  return (
    <FlatList
      data={data}
      scrollEnabled={true}
      keyExtractor={keyExtractor}
      renderItem={({ item, index }: any) => {
        return (
          <View
            key={index}
            style={[styles.chipsItem, { backgroundColor: "#fff" }]}
          >
            <Text style={{flexShrink: 1}}>{item}</Text>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  chipsItem: {
    borderRadius: 20,
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    color: "black",
    maxWidth: 150
  },
});

export default HorizontalScroll;
