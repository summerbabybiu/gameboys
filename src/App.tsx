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

  if (!romData) {
    return (<div className="App"></div>)
  }
  return (
    <div className="App">
      <LeftController onKeyDown={k => {
        if (!emulator) return;
        (emulator.current as any).onKeydown(k);
      }} onkeyUp={k => {
        if (!emulator) return;
        (emulator.current as any).onKeyup(k);
      }} />
      <div id="monitor">
        <Emulator romData={romData} ref={emulator}/>
      </div>
      <div id="right-controller">
        <RightController onKeyDown={k => {
          if (!emulator) return;
          (emulator.current as any).onKeydown(k);
        }} onkeyUp={k => {
          if (!emulator) return;
          (emulator.current as any).onKeyup(k);
        }} />
      </div>
    </div>
  );
}



export default App;
