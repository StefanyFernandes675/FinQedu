import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, Text, FlatList, Image, RefreshControl, ScrollView , Dimensions} from 'react-native';
import { styles } from './style';
import RankingItem from '../../components/RankingItem/RankingItem';
import Header from '../../components/Header/Header';

import Intern from '../../assets/intern-badge.png';
import Analyst from '../../assets/analyst-badge.png';
import Associate from '../../assets/associate-badge.png';
import VP from '../../assets/vp-badge.png';
import SeniorVP from '../../assets/seniorvp-badge.png';
import MD from '../../assets/md-badge.png';

const { width } = Dimensions.get('window');

export default function Ranking() {
  const [id, setId] = useState('');
  const [users, setUsers] = useState([]);
  const [money, setMoney] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const chooseRankingImage = () => {
    const images = [Intern, Analyst, Associate, VP, SeniorVP, MD];

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
    return images[level - 1];
  };

  const getUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        setId(parsedUser.id);
        setMoney(parsedUser.dollars);
      }
    } catch (error) {
      console.error('Erro ao recuperar os dados do usuário', error);
    }
  };

  const fetchRanking = async () => {
    if (!id) return; 

    try {
      const response = await fetch('https://finq-app-back-api.onrender.com/ranking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message && errorData.message.includes("Invalid uuid")) {
          setError("It looks like you have not taken any quiz yet. Test your knowledge and see how you rank or refresh the page.");
          setUsers([]); 
        } else {
          throw new Error(`Erro ao buscar o ranking: ${response.statusText}`);
        }
        return;
      }

      const data = await response.json();
      if (data && data.users) {
        const sortedUsers = data.users.sort((a, b) => b.experience - a.experience);
        setUsers(sortedUsers);
        setError(''); 
      }
    } catch (error) {
      console.error('Erro ao carregar o ranking:', error);
      setError('Failed to load ranking. Please try again later.');
      setUsers([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getUserData(); 
    if (id) {
      await fetchRanking();
    }
    setRefreshing(false);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await getUserData(); 
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (id) {
      fetchRanking();
    }
  }, [id]);
  
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SafeAreaView style={styles.container}>
        <Header />
        <Text style={styles.textRanking}>Ranking</Text>
        <Image source={chooseRankingImage()} style={[styles.image, {width: width * 0.3, height: width * 0.3}]} />

        {/* Exibe a mensagem de erro ou ranking */}
        {error ? (
          <Text style={styles.textNoData}>{error}</Text>
        ) : (
          <FlatList
            data={users}
            renderItem={({ item, index }) => (
              <RankingItem item={item} index={index} id={id} />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text style={styles.textNoData}>Loading...</Text>}
          />
        )}
      </SafeAreaView>
    </ScrollView>
  );
}
