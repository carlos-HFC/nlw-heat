import React from 'react';
import { View } from 'react-native';

import { styles } from './styles';
import { Button } from '../Button';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../theme';

export function SigninBox() {
  const { signIn, isSigning } = useAuth();

  return (
    <View style={styles.container}>
      <Button
        title="ENTRAR COM O GITHUB"
        color={COLORS.BLACK_PRIMARY}
        backgroundColor={COLORS.YELLOW}
        icon="github"
        onPress={signIn}
        isLoading={isSigning}
      />
    </View>
  );
}