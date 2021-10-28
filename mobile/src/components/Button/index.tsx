import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, ColorValue, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { styles } from './styles';

type ButtonProps = TouchableOpacityProps & {
  title: string;
  color: ColorValue;
  backgroundColor: ColorValue;
  icon?: React.ComponentProps<typeof AntDesign>['name'];
  isLoading?: boolean;
};

export function Button({ backgroundColor, isLoading = false, color, title, icon, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      activeOpacity={.7}
      disabled={isLoading}
      {...rest}
    >
      {isLoading
        ? <ActivityIndicator color={color} />
        : (
          <>
            <AntDesign name={icon} size={24} style={styles.icon} />

            <Text style={[styles.title, { color }]}>
              {title}
            </Text>
          </>
        )
      }
    </TouchableOpacity>
  );
}