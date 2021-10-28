import React, { useState } from 'react';
import { Alert, Keyboard, TextInput, View } from 'react-native';

import { styles } from './styles';
import { Button } from '../Button';
import { COLORS } from '../../theme';
import { api } from '../../services/api';

export function SendMessageForm() {
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  async function handleMessageSubmit() {
    if (message.trim().length <= 0) return Alert.alert('Escreva a mensagem para enviar!');

    setSendingMessage(true);

    await api.post('/messages', { message });

    setMessage('');
    Keyboard.dismiss();
    setSendingMessage(false);
    // Alert.alert('Mensagem enviada com sucesso!');
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        keyboardAppearance="dark"
        placeholder="Qual a sua expectativa para o evento?"
        placeholderTextColor={COLORS.GRAY_PRIMARY}
        multiline
        maxLength={140}
        value={message}
        onChangeText={setMessage}
        editable={!sendingMessage}
      />
      <Button
        title="ENVIAR MENSAGEM"
        color={COLORS.WHITE}
        backgroundColor={COLORS.PINK}
        isLoading={sendingMessage}
        onPress={handleMessageSubmit}
      />
    </View>
  );
}