import React, { useState,useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image } from 'react-native';
import Slider from '../../components/Slider/Slider';
import Header from '../../components/Header/Header';
import * as Progress from 'react-native-progress';

import {styles} from './style';

export default function Home({ navigation }) {
  const [name, setName] = useState('');
  const [money, setMoney] = useState(0);

  const getUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      if (user !== null && token !== null) {
        const parsedUser = JSON.parse(user);

        const nameParts = parsedUser.name.split(' ');
        const firstName = nameParts[0];

        setName(firstName);
        setMoney(money)
      }
    } catch (error) {
      console.error('Erro ao recuperar os dados do usuário', error);
    }
  };

  const chooseRankingName = () => {
      const nameRanking = ['Intern', 'Analyst', 'Associate', 'VP', 'SeniorVP', 'MD'];
  
      let level = 1;
      if (money >= 0 && money <= 150) {
        level = 1;
      } else if (money > 150 && money <= 300) {
        level = 2;
      } else if (money > 300 && money <= 450) {
        level = 3;
      } else if (money > 450 && money <= 600) {
        level = 4;
      } else if (money > 600 && money <= 750) {
        level = 5;
      } else {
        level = 6;
      }
      return nameRanking[level - 1];
    };

  useEffect(() => {
    getUserData();
  }, []);


  return (
    
      <View style={styles.container}>
          <Header  />
        <Text style={styles.textTitle}>👋 Hey, {name}!</Text>
        <View style={styles.watched}>
          <Text style={styles.watchedText}>Ranking 🏆</Text>
          <Text style={styles.watchedTotal}>chooseRankingName();</Text>
        </View>
        <Text style={styles.textMarket}>Market Place</Text>
        <Slider />
      </View>
    
  );
}
