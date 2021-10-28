import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import io from 'socket.io-client';

import { styles } from './styles';
import { Message, MessageProps } from '../Message';
import { api } from '../../services/api';
import { MESSAGES_EXAMPLE } from '../../utils/messages';

const messageQueue: MessageProps[] = MESSAGES_EXAMPLE

const socket = io(String(api.defaults.baseURL));
socket.on('new_message', message => messageQueue.push(message));

export function MessageList() {
  const [messages, setMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    api.get<MessageProps[]>('/messages/lasts').then(response => setMessages(response.data));
  }, []);

  useEffect(() => {
    setInterval(() => {
      if (messageQueue.length > 0) {
        setMessages(prevState => [messageQueue[0], prevState[0], prevState[1]].filter(Boolean));
        messageQueue.shift();
      }
    }, 3000);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    >
      {messages.map((message, i) => (
        <Message data={message} key={i} />
      ))}
    </ScrollView>
  );
}