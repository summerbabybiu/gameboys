import React, { useState, useEffect, useRef } from 'react';
import Emulator from './nesweb/Emulator';
import { NESGames, loadBinary } from './GameRoms';
import './App.css';
import { LeftController, RightController } from './GameController';

function App() {
  const [romData, setRomData] = useState(null);
  const [url, setUrl] = useState('');
  const emulator = useRef(null);

  useEffect(() => {
    if (url.length === 0) return;
    loadBinary(url, (e, data) => {
      if (data) {
        setRomData(data);
      }
    }, progress => {
      console.log(progress);
    });
  }, [url]);

  const handleKeyDown = (k: number) => {
    console.log('keydown', k);
    if ((window as any).nes) {
      (window as any).nes.buttonDown(1, k);
    }
  }

  const handleKeyUp = (k: number) => {
    console.log('keyup', k);
    if ((window as any).nes) {
      (window as any).nes.buttonUp(1, k);
    }
  }

  // if (!romData) {
  //   return (<div className="App"></div>)
  // }
  return (
    <div className="App">
      <LeftController onKeyDown={k => handleKeyDown(k)} onkeyUp={k => handleKeyUp(k)} />
      <div id="monitor">
        { romData ? <Emulator romData={romData} ref={emulator}/> : <GameList onselect={ url => setUrl(url)}/> }
      </div>
      <div id="right-controller">
        <RightController onKeyDown={k => handleKeyDown(k)} onkeyUp={k => handleKeyUp(k)} />
      </div>
    </div>
  );
}


function GameList(props: { onselect: (url: string) => void}) {
  return (
    <div className="game-list" onClick={e => {
      const url = (e.target as any).getAttribute('data-key');
      if (!url) return;
      props.onselect(url);
      if (!(window as any).audioContext) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        (window as any).audioContext = new AudioContext();
        (window as any).audioContext.resume();
      }
    }}>
      {NESGames.map(game => {
        return (
          <div className="game" key={game.url} data-key={game.url}>{game.name}</div>
        );
      })}
    </div>
  );
}


export default App;
