import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, Text, FlatList, Image, RefreshControl, ScrollView } from 'react-native';
import { styles } from './style';
import RankingItem from '../../components/RankingItem/RankingItem';
import Header from '../../components/Header/Header';

import Intern from '../../assets/intern-badge.png';
import Analyst from '../../assets/analyst-badge.png';
import Associate from '../../assets/associate-badge.png';
import VP from '../../assets/vp-badge.png';
import SeniorVP from '../../assets/seniorvp-badge.png';
import MD from '../../assets/md-badge.png';

export default function Ranking() {
  const [id, setId] = useState('');
  const [users, setUsers] = useState([]);
  const [money, setMoney] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Função para escolher a imagem de ranking com base no dinheiro
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

  // Função para buscar os dados do usuário
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

  // Função para buscar o ranking
  const fetchRanking = async () => {
    if (!id) return; // Evita requisição desnecessária se o ID não estiver carregado
    try {
      const response = await fetch('https://finq-app-back-api.onrender.com/ranking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar o ranking: ${response.statusText}`);
      }

      const data = await response.json();
      if (data && data.users) {
        const sortedUsers = data.users.sort((a, b) => b.experience - a.experience);
        setUsers(sortedUsers);
      }
    } catch (error) {
      console.error('Erro ao carregar o ranking:', error);
    }
  };

  // Função de pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await getUserData();
    await fetchRanking();
    setRefreshing(false);
  };

  // Carrega os dados iniciais ao montar o componente
  useEffect(() => {
    const loadInitialData = async () => {
      await getUserData();
      await fetchRanking();
    };

    loadInitialData();
  }, []); // Sem dependências adicionais

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
        <Image source={chooseRankingImage()} style={styles.image} />
        <FlatList
          data={users}
          renderItem={({ item, index }) => (
            <RankingItem item={item} index={index} id={id} />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !refreshing && <Text style={styles.textNoData}>It looks like you haven't taken any quiz yet. Test your knowledge and see how you rank</Text>
          }
        />
      </SafeAreaView>
    </ScrollView>
  );
}
