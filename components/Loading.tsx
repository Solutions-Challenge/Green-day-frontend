import React, { Component, useContext } from "react";
import { StyleSheet, Image, View } from "react-native";
// @ts-ignore
import Spinner from "react-native-loading-spinner-overlay";
import ImageContext from "../hooks/imageContext";
import * as LottieView from "lottie-react-native";

const Loading = () => {
  const [isLoading, setIsLoading] = useContext(ImageContext).isLoading;
  console.log(isLoading);
  return (
    <>
      <Spinner
        visible={isLoading}
        customIndicator={
          <LottieView.default
            style={{
              width: 150,
              height: 150,
              borderRadius: 150
            }}
            autoPlay
            source={require("../assets/lottie/loading.json")}
          />
        }
      />
    </>
  );
};

export default Loading;

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});
