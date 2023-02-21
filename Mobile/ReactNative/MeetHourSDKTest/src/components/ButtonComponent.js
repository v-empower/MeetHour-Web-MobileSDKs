import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import LoaderComponent from "./LoaderComponent"

export default function ButtonComponent(props) {
  const { onPress = () => console.log(), title, backgroundColor, height, width } = props;
  const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 2,
      borderRadius: 4,
      elevation: 3,
      width: width,
      height: height,
      backgroundColor: backgroundColor
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
  });
  return (
    <Pressable style={styles.button} onPress={() => onPress()}>
      {props.isLoading ? <LoaderComponent/> : <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
}

