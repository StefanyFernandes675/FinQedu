import React from 'react';
import {StyleSheet} from 'react-native'
import {COLORS} from '../../assets/colors/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 100
  },
  textTitle: {
    fontFamily: 'inter',
    fontSize: 24,
    color: COLORS.purpleDark,
    marginHorizontal: 12,
    marginVertical: 20,
  },
  watched: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E8E3FA',
    borderRadius: 12,
    width: '100%', 
  },
  watchedText: {
    fontFamily: 'archivo',
    fontSize: 14,
    color: COLORS.purpleDark,
  },
  watchedTotal: {
    fontFamily: 'archivo',
    fontSize: 20,
    color: COLORS.purpleDark,
    fontWeight: '800'
  },
  watchedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  textMarket: {
    fontFamily: 'inter',
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.purpleDark,
    marginHorizontal: 12,
    marginVertical: 20,
  }
});
