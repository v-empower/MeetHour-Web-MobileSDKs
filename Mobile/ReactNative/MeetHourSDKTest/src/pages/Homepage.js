import React, {Component} from 'react';
import {ApiServices} from 'react-native-meet-hour-sdk';
import {View, Text, StyleSheet, Pressable, Button, Alert} from 'react-native';
import {useState} from 'react';
import Description from '../components/Description';
import {CLIENT_ID, CLIENT_SECRET, EMAIL, PASSWORD} from '../constants/index';
import ButtonComponent from '../components/ButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loginBody = {
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  username: EMAIL,
  password: PASSWORD,
};

const HomePage = () => {
  const [isHomepage, setIsHomepage] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const getAccessToken = async () => {

    setIsLoading(true);
    let response;
    try {
      await AsyncStorage.clear();
      response = await ApiServices.login(loginBody);
      await AsyncStorage.setItem('accessToken', response.access_token);
      Alert.alert("Success", "Token generated successfully. Now you can schedule a meeting.")
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong. Please check the credentials you have provided.")
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Description isHomepage={isHomepage}/>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ButtonComponent
          isLoading={isLoading}
          onPress={getAccessToken}
          title="Get Access Token"
          backgroundColor="black"
          height={60}
          width={250}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginTop: 80,
  },
});

export default HomePage;
