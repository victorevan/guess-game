import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';

const socket = io('http://localhost:3001');

function App() {
  const [name, setName] = useState('');
  const [creatingRoom, isCreatingRoom] = useState("");
  const [joiningRoom, isJoiningRoom] = useState("");

  const joinRoom = () => {
    if (name !== "" && joiningRoom === "") {
      socket.emit("join_room", joiningRoom);
    }
  };

  const createRoom = () => {
    if (name !== "" && createRoom === "") {
      socket.emit("create_room", creatingRoom);
    }
  };

  return (
    <div className="App">
      <header className="App-header">Guess Game
      <form className='Menu'>
        <input 
        type="text" 
        placeholder="Enter your name"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
        />
        <button type="submit" onClick={joinRoom}>Join Game</button>
        <button type="submit" onClick={createRoom}>Create Game</button>
      </form>
      <div>
        <h1>About</h1>
      </div>
      </header>
    </div>
  );
}

export default App;
