import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Joystick } from 'react-joystick-component';
import { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick';

const JOYSTICK_OFFSET = 40;

interface IProps {
  onKeyDown: (key: number) => void;
  onKeyUp: (key: number) => void;
}

const LeftStick = (props: IProps) => {
  const [keyStatus, setKeyStatus] = useState(DirectionStatus.NONE);
  const prevKeyStatus = useRef(DirectionStatus.NONE);
  useEffect(() => {
    const prevKeys = RetriveButtonKeysByStatus(prevKeyStatus.current);
    const keys = RetriveButtonKeysByStatus(keyStatus);
    prevKeys.filter(p => keys.indexOf(p) < 0).forEach(k => props.onKeyUp(k));
    keys.forEach(k => props.onKeyDown(k));
    prevKeyStatus.current = keyStatus;
  }, [keyStatus]);

  const handleStart = useCallback((event: IJoystickUpdateEvent) => console.log(event), []);

  const handleMove = useCallback((event: IJoystickUpdateEvent) => {
    const { x, y } = event;
    switch(event.direction) {
      case 'LEFT': 
        if (y && y >= 20) {
          setKeyStatus(DirectionStatus.LEFT_TOP);
        } else if (y && y <= -20) {
          setKeyStatus(DirectionStatus.LEFT_BOTTOM);
        } else {
          setKeyStatus(DirectionStatus.LEFT);
        }
      break;
      case 'RIGHT': 
        if (y && y >= 20) {
          setKeyStatus(DirectionStatus.RIGHT_TOP);
        } else if (y && y <= -20) {
          setKeyStatus(DirectionStatus.RIGHT_BOTTOM);
        } else {
          setKeyStatus(DirectionStatus.RIGHT);
        }
      break;
      case 'BACKWARD':
        if (x && x >= 20) {
          setKeyStatus(DirectionStatus.RIGHT_BOTTOM);
        } else if (x && x <= -20) {
          setKeyStatus(DirectionStatus.LEFT_BOTTOM);
        } else {
          setKeyStatus(DirectionStatus.BOTTOM);
        }
         break;
      case 'FORWARD': 
      if (x && x >= 20) {
        setKeyStatus(DirectionStatus.RIGHT_TOP);
      } else if (x && x <= -20) {
        setKeyStatus(DirectionStatus.LEFT_TOP);
      } else {
        setKeyStatus(DirectionStatus.TOP);
      }
      break;
    }
  }, []);
  const handleStop = useCallback((event: IJoystickUpdateEvent) => {
    const keys = RetriveButtonKeysByStatus(keyStatus);
    keys.forEach(k => props.onKeyUp(k));
    setKeyStatus(DirectionStatus.NONE);
  }, []);

  return (
    <div id="left-controller">
      <Joystick size={JOYSTICK_OFFSET * 2} baseColor="#eee" stickColor='#999' move={handleMove} stop={handleStop}/>
    </div>
  );
}

export default LeftStick;

export enum ControllerKeys {
  BUTTON_A = 0,
  BUTTON_B = 1,
  BUTTON_SELECT = 2,
  BUTTON_START = 3,
  BUTTON_UP = 4,
  BUTTON_DOWN = 5,
  BUTTON_LEFT = 6,
  BUTTON_RIGHT = 7,
};

export interface ControllerProps {
  onKeyDown: (key: number) => void;
  onkeyUp: (key: number) => void;
};

enum DirectionStatus {
  NONE = 0,
  LEFT = 1 << 1,
  TOP = 1 << 2,
  RIGHT = 1 << 3,
  BOTTOM = 1 << 4,
  LEFT_TOP = 1 << 5,
  RIGHT_TOP = 1 << 6,
  RIGHT_BOTTOM = 1 << 7,
  LEFT_BOTTOM = 1 << 8
};

function RetriveButtonKeysByStatus(status: number) {
  let keys: number[] = [];
  switch (status) {
      case DirectionStatus.TOP: keys = [ControllerKeys.BUTTON_UP]; break;
      case DirectionStatus.LEFT: keys = [ControllerKeys.BUTTON_LEFT]; break;
      case DirectionStatus.BOTTOM: keys = [ControllerKeys.BUTTON_DOWN]; break;
      case DirectionStatus.RIGHT: keys = [ControllerKeys.BUTTON_RIGHT]; break;
      case DirectionStatus.LEFT_TOP: keys = [ControllerKeys.BUTTON_LEFT, ControllerKeys.BUTTON_UP]; break;
      case DirectionStatus.LEFT_BOTTOM: keys = [ControllerKeys.BUTTON_LEFT, ControllerKeys.BUTTON_DOWN]; break;
      case DirectionStatus.RIGHT_TOP: keys = [ControllerKeys.BUTTON_RIGHT, ControllerKeys.BUTTON_UP]; break;
      case DirectionStatus.RIGHT_BOTTOM: keys = [ControllerKeys.BUTTON_DOWN, ControllerKeys.BUTTON_RIGHT]; break;
  }
  return keys;

}