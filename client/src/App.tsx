import './App.css';
import io from 'socket.io-client';
import { useEffect, useMemo, useState } from 'react';
import ChatTest from './ChatTest.tsx';
import React from 'react';

function App() {
  const [roomNumber, setRoomNumber] = useState(null);
  const [name, setName] = useState('');
  const [lobbyJoinId, setLobbyJoinId] = useState('');
  // const [creatingLobby, isCreatingLobby] = useState(false);
  // const [joiningLobby, isJoiningLobby] = useState(false);
  const socket = useMemo(() => io('http://localhost:3001'), []);

  const joinLobby = () => {
    if (name !== '' && lobbyJoinId !== '') {
      socket.emit('join_lobby', Number(lobbyJoinId));
      // isJoiningLobby(true);
    }
  };

  const createLobby = () => {
    if (!name) {
      alert('Please enter your name');
    }

    socket.emit('create_lobby', name);
  };

  useEffect(() => {
    socket.on('lobby_created', (lobby) => {
      setRoomNumber(lobby);
    });

    socket.on('lobby_joined', (lobby) => {
      setRoomNumber(lobby);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        Guess Game
        {roomNumber && (
          <div
            style={{
              marginTop: '20px',
              marginBottom: '20px',
            }}
          >
            <div>Room Number</div>
            <div>{roomNumber}</div>
          </div>
        )}
        <div className="Menu">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Enter lobby ID"
            value={lobbyJoinId}
            onChange={(event) => {
              setLobbyJoinId(event.target.value);
            }}
          />
          <button onClick={joinLobby}>Join Game</button>
          <button onClick={createLobby}>Create Game</button>
        </div>
        <div>
          <h2>About</h2>
        </div>
        <ChatTest socket={socket} name={name} lobby={roomNumber} />
      </header>
    </div>
  );
}

export default App;
