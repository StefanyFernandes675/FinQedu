import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import eventEmitter from '../../components/events';
import { styles } from './style';

import { COLORS } from '../../assets/colors/colors';
import Badge from '../../assets/badge-3.png';
import Coffee from '../../assets/coffee.png';
import Money from '../../assets/money.png';
import Books from '../../assets/books.png';

import Intern from '../../assets/intern-badge.png';
import Analyst from '../../assets/analyst-badge.png';
import Associate from '../../assets/associate-badge.png';
import VP from '../../assets/vp-badge.png';
import SeniorVP from '../../assets/seniorvp-badge.png';
import MD from '../../assets/md-badge.png';

const {width} = Dimensions.get('window');

export default function Profile({ navigation }) {
  const [total, setTotal] = useState(1);
  const [watched, setWatched] = useState(1);
  const [name, setName] = useState('Finq Owl');
  const [streak, setStreak] = useState(0);
  const [money, setMoney] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [initials, setInitials] = useState('FinQ');
  
  const progress = watched / total;

  const getUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        setMoney(parsedUser.dollars || 0);
        setStreak(parsedUser.streak_count || 0);

        const nameParts = (parsedUser.name || 'Finq Owl').split(' ');
        const twoNames = nameParts.slice(0, 2).join(' ');
        setName(twoNames);

        const initials = nameParts.slice(0, 2).map(name => name.charAt(0).toUpperCase()).join('');
        setInitials(initials);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    getUserData();
    const subscription = eventEmitter.on('userDataUpdated', getUserData);
    return () => subscription.off('userDataUpdated', getUserData);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true); 
    await getUserData(); 
    setRefreshing(false);
  };

  const chooseRankingImage = (money) => {
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

  const chooseRankingName = (money) => {
    const images = ['Intern', 'Analyst', 'Associate', 'VP', 'SeniorVP', 'MD'];

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

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={[styles.containerInitials, {width: width * 0.3, height: width * 0.3}]}>
        <Text style={styles.textIntitials}>{initials}</Text>
      </View>
      <View>
        <View style={styles.containerNameFlag}>
          <Text style={styles.textName}>{name}</Text>
          <FontAwesome name="flag" size={24} color={COLORS.purpleDark} />
        </View>
        <View>
          <View style={styles.watched}>
            <Text style={styles.watchedText}>Watched classes</Text>
            <Text style={styles.watchedTotal}>{watched} of {total}</Text>
            <Progress.Bar
              progress={progress}
              width={200}
              color="#6A5ACD"
              unfilledColor="#D3D3D3"
              borderColor="#6A5ACD"
            />
          </View>
          <View style={styles.stats}>
            <Text style={styles.textName}>Statistics</Text>
            <View style={styles.rowStats}>
              <View style={styles.itemStats}>
                <Image source={Coffee} style={styles.imgStats} />
                <View style={styles.textContainer}>
                  <Text style={styles.textStats}>{streak}</Text>
                  <Text style={styles.descStats}>Day Streak</Text>
                </View>
              </View>
              <View style={styles.itemStats}>
                <Image source={Money} style={styles.imgStats} />
                <View style={styles.textContainer}>
                  <Text style={styles.textStats}>${money}</Text>
                  <Text style={styles.descStats}>Total Money</Text>
                </View>
              </View>
            </View>
            <View style={styles.rowStats}>
              <View style={styles.itemStats}>
                <Image source={chooseRankingImage(money)} style={styles.imgStats} />
                <View style={styles.textContainer}>
                  <Text style={styles.textStats}>{chooseRankingName(money)}</Text>
                  <Text style={styles.descStats}>League</Text>
                </View>
              </View>
              <View style={styles.itemStats}>
                <Image source={Books} style={styles.imgStats} />
                <View style={styles.textContainer}>
                  <Text style={styles.textStats}>Prep</Text>
                  <Text style={styles.descStats}>Top Course</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}