import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { styles } from './style';
import { COLORS } from '../../assets/colors/colors';

import Header from '../../components/Header/Header';

// Importando as badges
import Intern from '../../assets/intern-badge.png';
import Analyst from '../../assets/analyst-badge.png';
import Associate from '../../assets/associate-badge.png';
import VP from '../../assets/vp-badge.png';
import SeniorVP from '../../assets/seniorvp-badge.png';
import MD from '../../assets/md-badge.png';

const rankBadges = {
  Intern,
  Analyst,
  Associate,
  VP,
  SeniorVP,
  MD
};

const rankLevels = ['Intern', 'Analyst', 'Associate', 'VP', 'SeniorVP', 'MD'];

export default function Quiz({ navigation }) {
  const [completed, setCompleted] = useState({});
  const [id, setId] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = (categoryId) => {
    setCompleted((prevState) => ({
      ...prevState,
      [categoryId]: true,
    }));
  };

  const getUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      if (user !== null && token !== null) {
        const parsedUser = JSON.parse(user);
        setId(parsedUser.id);
      }
    } catch (error) {
      console.error('Erro ao recuperar os dados do usuário', error);
    }
  };

  const getCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://finq-app-back-api.onrender.com/category', { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar categorias: ${response.statusText}`);
      }

      const data = await response.json();
      setCategories(data.category);

    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
    getCategories();
  }, []);

  // Função para distribuir os quizzes entre os níveis
  const distributeQuizzes = (totalQuizzes) => {
    const quizzesPerRank = [];

    // A lógica de distribuição depende do número de quizzes disponíveis
    if (totalQuizzes >= 7) {
      rankLevels.forEach((rank, index) => {
        quizzesPerRank.push({ rank, quizzes: 1 });
      });
      // Distribuir os quizzes restantes
      for (let i = 0; i < totalQuizzes - 6; i++) {
        quizzesPerRank[i].quizzes += 1;
      }
    } else if (totalQuizzes === 6) {
      rankLevels.forEach((rank, index) => {
        quizzesPerRank.push({ rank, quizzes: 1 });
      });
    } else if (totalQuizzes === 5) {
      quizzesPerRank.push({ rank: 'Intern', quizzes: 1 });
      quizzesPerRank.push({ rank: 'Analyst', quizzes: 1 });
      quizzesPerRank.push({ rank: 'Associate', quizzes: 1 });
      quizzesPerRank.push({ rank: 'VP', quizzes: 1 });
      quizzesPerRank.push({ rank: 'SeniorVP', quizzes: 1 });
    } else if (totalQuizzes === 4) {
      quizzesPerRank.push({ rank: 'Intern', quizzes: 1 });
      quizzesPerRank.push({ rank: 'Analyst', quizzes: 1 });
      quizzesPerRank.push({ rank: 'Associate', quizzes: 1 });
      quizzesPerRank.push({ rank: 'VP', quizzes: 1 });
    } else if (totalQuizzes === 3) {
      quizzesPerRank.push({ rank: 'Intern', quizzes: 1 });
      quizzesPerRank.push({ rank: 'Analyst', quizzes: 1 });
      quizzesPerRank.push({ rank: 'Associate', quizzes: 1 });
    } else if (totalQuizzes === 2) {
      quizzesPerRank.push({ rank: 'Intern', quizzes: 1 });
      quizzesPerRank.push({ rank: 'Analyst', quizzes: 1 });
    } else if (totalQuizzes === 1) {
      quizzesPerRank.push({ rank: 'Intern', quizzes: 1 });
    }

    return quizzesPerRank;
  };

  const totalQuizzes = categories.length; 
  const distributedQuizzes = distributeQuizzes(totalQuizzes);

  const renderCategory = ({ item }) => {
    const completedCategory = completed[item.id];

    return (
      <TouchableOpacity
        style={[
          styles.quizItem,
          { backgroundColor: completedCategory ? '#d4edda' : '#fff' },
        ]}
        onPress={() => {
          navigation.navigate('Questions', {
            userId: id,
            categoryId: item.id,
            onComplete: () => handleComplete(item.id),
          });
        }}
      >
        {/* Exibir níveis e quantidade de quizzes */}
        {distributedQuizzes.map(({ rank, quizzes }) => (
          <View key={rank} style={styles.rankContainer}>
            <Image source={rankBadges[rank]} style={styles.rankBadge} />
            <Text style={styles.rankText}>
              {rank}
            </Text>
          </View>
        ))}
        <Text style={styles.quizText}>{item.name}</Text>
        <Text style={styles.quizDetails}>{item.description}</Text>
        <Text style={styles.quizDetails}>5 questions</Text>
        {completedCategory && <Text style={styles.status}>✅ Completed</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      {isLoading ? (
        <Text style={styles.loadingText}>Loading Categories...</Text>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={renderCategory}
        />
      )}
    </View>
  );
}
