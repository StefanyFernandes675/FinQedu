import React, { useState, useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import eventEmitter from '../events'; // Caminho para o arquivo de eventos
import { styles } from './style';

import Coffee from '../../assets/coffee.png';
import Money from '../../assets/money.png';
import Heart from '../../assets/heart.png';

const Header = () => {
  const [userData, setUserData] = useState({
    streak: 0,
    dollars: 0,
    lifes: 0,
  });

  const fetchUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData({
          streak: parsedUser.streak_count || 0,
          dollars: parsedUser.dollars || 0,
          lifes: parsedUser.lifes || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    const subscription = eventEmitter.on('userDataUpdated', fetchUserData);
    return () => subscription.off('userDataUpdated', fetchUserData);
  }, []); 

  return (
    <View style={styles.header}>
      <Text style={styles.textCategory}>IB PREP</Text>
      <View style={styles.info}>
        <View style={styles.row}>
          <Image source={Coffee} style={styles.image} />
          <Text style={styles.textStreak}>{userData.streak}</Text>
        </View>
        <View style={styles.row}>
          <Image source={Money} style={styles.image} />
          <Text style={styles.textMoney}>${userData.dollars}</Text>
        </View>
        <View style={styles.row}>
          <Image source={Heart} style={styles.image} />
          <Text style={styles.textHeart}>{userData.lifes}</Text>
        </View>
      </View>
    </View>
  );
};

export default Header;
