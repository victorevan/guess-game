import React, { useEffect, useMemo, useState } from 'react';
import { Socket } from 'socket.io-client';

type MessageData = {
  lobby: number;
  author: string;
  message: string;
  time: string;
};

type ChatTestProps = {
  socket: Socket;
  name: string;
  lobby: number;
};

function ChatTest({ socket, name, lobby }: ChatTestProps) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState<MessageData[]>([]);

  const addMessage = useMemo(
    () => (data: MessageData) => {
      setMessageList((list) => [...list, data]);
    },
    []
  );

  useEffect(() => {
    socket.on('receive_message', addMessage);

    // this clean-up function prevents duplicate listeners on re-renders
    return () => {
      socket.off('receive_message', addMessage);
    };
  }, [socket, addMessage]);

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData: MessageData = {
        lobby: lobby,
        author: name,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit('send_message', messageData);
      setMessageList((messageList) => [...messageList, messageData]);
      setCurrentMessage('');
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <div className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                key={messageContent.time}
                className="message"
                id={name === messageContent.author ? 'you' : 'other'}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === 'Enter' && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default ChatTest;
