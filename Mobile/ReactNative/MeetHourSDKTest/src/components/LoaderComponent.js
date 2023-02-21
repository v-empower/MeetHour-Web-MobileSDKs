import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
export default function LoaderCompenent() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
  });
  return (
    <View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator size="large" />
  </View>
  );
}
