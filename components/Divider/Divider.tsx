import React from 'react';
import { View, ViewStyle } from 'react-native';
import {COLORS} from '../../assets/colors/colors';

interface DividerProps {
  width?: number;
  orientation?: 'horizontal' | 'vertical';
  color?: string;
  marginH?: number;
  dividerStyle?: ViewStyle;
}

const Divider: React.FC<DividerProps> = ({
  width = 1,
  orientation = 'horizontal',
  color = COLORS.purpleDark,
  marginH = 12,
  dividerStyle,
}) => {
  const dividerStyles: ViewStyle = {
    width: orientation === 'horizontal' ? '100%' : width,
    height: orientation === 'vertical' ? '100%' : width,
    backgroundColor: color,
    marginHorizontal: marginH,
    ...dividerStyle, 
  };

  return <View style={dividerStyles} />;
};

export default Divider;
