import React, { Component, useContext } from 'react';
import { StyleSheet, Image } from 'react-native';
// @ts-ignore
import Spinner from 'react-native-loading-spinner-overlay';
import ImageContext from '../hooks/imageContext';

const Loading = () => {
  const [isLoading, setIsLoading] = useContext(ImageContext).isLoading
  return (<>
    <Spinner
      visible={isLoading}
      textContent={'Loading...'}
      textStyle={styles.spinnerTextStyle}
    />
  </>
  );
}

export default Loading

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});