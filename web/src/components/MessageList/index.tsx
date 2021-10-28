import { useEffect, useState } from 'react';
import io from 'socket.io-client';

import styles from './styles.module.scss';
import logo from '../../assets/logo.svg';
import { api } from '../../services/api';

type Message = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  };
};

const messageQueue: Message[] = [];

const socket = io('http://localhost:8000');

socket.on('new_message', message => {
  messageQueue.push(message);
});

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setInterval(() => {
      if (messageQueue.length > 0) {
        setMessages(prevState => [messageQueue[0], prevState[0], prevState[1]].filter(Boolean));

        messageQueue.shift();
      }
    }, 3000);
  }, []);

  useEffect(() => {
    api.get<Message[]>('/messages/lasts').then(response => setMessages(response.data));
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logo} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {messages.map((message, i) => (
          <li className={styles.message} key={message.id || i}>
            <p className={styles.messageContent}>{message.text}</p>
            <div className={styles.messageUser}>
              <div className={styles.userImage}>
                <img src={message.user.avatar_url} alt={message.user.name} />
              </div>
              <span>{message.user.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}