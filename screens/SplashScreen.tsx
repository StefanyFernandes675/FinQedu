import React, { useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Image } from 'react-native';
import Icon from '../assets/logo.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const parts = token.split('.');

          if (parts.length === 3) {
            const payload = parts[1];
            const decodedPayload = JSON.parse(atob(payload)); 

            const tokenExpiry = decodedPayload?.exp * 1000; 
            const currentTime = Date.now(); 

            if (currentTime < tokenExpiry) {
              navigation.replace('MainTabs');
            } else {
              navigation.replace('Login');
            }
          } else {
            navigation.replace('Login');
          }
        } catch (error) {
          console.error('Erro ao verificar o token:', error);
          navigation.replace('Login');
        }
      } else {
        navigation.replace('Login');
      }
    };

    const timer = setTimeout(() => {
      checkToken();
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image source={Icon} style={styles.image} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  image: {
    width: 177.84,
    height: 74.89,
    resizeMode: 'contain',
  },
});
