import React, { useState, useEffect, useRef } from 'react';
import Emulator from './nesweb/Emulator';
import { NESGames, loadBinary } from './GameRoms';
import './App.css';
import { LeftController, RightController } from './GameController';

function App() {
  const [romData, setRomData] = useState(null);
  const [game, setGame] = useState(NESGames[0]);
  const emulator = useRef(null);

  useEffect(() => {
    loadBinary(game.url, (e, data) => {
      if (data) {
        setRomData(data);
      }
    }, progress => {
      console.log(progress);
    });
  }, []);

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

  if (!romData) {
    return (<div className="App"></div>)
  }
  return (
    <div className="App">
      <LeftController onKeyDown={k => handleKeyDown(k)} onkeyUp={k => handleKeyUp(k)} />
      <div id="monitor">
        <Emulator romData={romData} ref={emulator}/>
      </div>
      <div id="right-controller">
        <RightController onKeyDown={k => handleKeyDown(k)} onkeyUp={k => handleKeyUp(k)} />
      </div>
    </div>
  );
}



export default App;
