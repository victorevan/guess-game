import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';
import ChatTest from './ChatTest';

const socket = io('http://localhost:3001');

function App() {
  const [name, setName] = useState('');
  const [lobby, setLobby] = useState('');
  // const [creatingLobby, isCreatingLobby] = useState(false);
  // const [joiningLobby, isJoiningLobby] = useState(false);



  const joinLobby = () => {
    if (name !== "" && lobby !== "") {
      socket.emit("join_lobby", lobby);
      // isJoiningLobby(true);
    }
  };

  const createLobby = () => {
    var randomLobbyNumber = Math.floor(Math.random() * 10000) + 1;
    socket.emit("create_lobby", `${randomLobbyNumber}`);
  };

  return (
    <div className="App">
      <header className="App-header">Guess Game 
      <div className='Menu'>
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
      value={lobby}
      onChange={(event) => {
        setLobby(event.target.value);
      }}
      />
        <button onClick={joinLobby}>Join Game</button>
        <button onClick={createLobby}>Create Game</button>
      </div>
      <div>
        <h2>About</h2>
      </div>
      <ChatTest socket={socket} name={name} lobby={lobby} />
      </header>
    </div>
  );
}

export default App;
