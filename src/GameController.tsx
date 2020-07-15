import React from 'react';
declare module jsnes { };

// const KEYDOWN = 0x41;
// const KEYUP = 0x40;

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

// class Controller {
//     state: Number[];
//     constructor() {
//         this.state = new Array(8);
//         this.state.fill(KEYUP);
//     }
//     public buttonDown(key: number) {
//         this.state[key] = 0x41;
//     }

//     public buttonUp(key: number) {
//         this.state[key] = 0x40;
//     }
// };

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

export class LeftController extends React.Component<ControllerProps, any> {
    stick: any;
    constructor(props: ControllerProps) {
        super(props);
        this.state = {
            currentstatus: 0
        };
        this.stick = React.createRef();
    }

    handleTouchStart(ev: TouchEvent) {
        if (!this.stick) return;
        const touch = ev.targetTouches[0];
        const rect = (this.stick.current as any).getBoundingClientRect();
        this.dispatchTouchEvent(rect as DOMRect, { x: touch.pageX, y: touch.pageY });
        ev.preventDefault();
    };

    handleTouchMove(ev: TouchEvent) {
        if (!this.stick.current) return;
        const touch = ev.targetTouches[0];
        const rect = (this.stick.current as any).getBoundingClientRect();
        this.dispatchTouchEvent(rect as DOMRect, { x: touch.pageX, y: touch.pageY });
        ev.preventDefault();
    };

    handleTouchEnd(ev: TouchEvent) {
        // console.log(ev);
        // if (!this.stick.current) return;
        // const touch = ev.targetTouches[0];
        // const rect = (this.stick.current as any).getBoundingClientRect();
        // this.dispatchTouchEvent(rect as DOMRect, { x: touch.pageX, y: touch.pageY });
        const keys = RetriveButtonKeysByStatus(this.state.currentStatus);
        keys.forEach(k => this.props.onkeyUp(k));
        this.setState({
            currentStatus: DirectionStatus.NONE
        })
        ev.preventDefault();
    };


    dispatchTouchEvent(rect: DOMRect, touchPoint: { x: number, y: number }) {
        const midX = (rect.left + rect.right) / 2;
        const midY = (rect.top + rect.bottom) / 2;
        let nextStatus = DirectionStatus.NONE;
        if (touchPoint.x < (midX - 22)) {
            if (touchPoint.y < (midY - 22)) {
                nextStatus = DirectionStatus.LEFT_TOP;
            } else if (touchPoint.y >= (midY - 22) && touchPoint.y < (midY + 22)) {
                nextStatus = DirectionStatus.LEFT;
            } else if (touchPoint.y >= (midY + 22)) {
                nextStatus = DirectionStatus.LEFT_BOTTOM;
            }
        } else if (touchPoint.x >= (midX - 22) && touchPoint.x < (midX + 22)) {
            if (touchPoint.y < (midY - 22)) {
                nextStatus = DirectionStatus.TOP;
            } else if (touchPoint.y >= (midY - 22) && touchPoint.y < (midY + 22)) {
            } else if (touchPoint.y >= (midY + 22)) {
                nextStatus = DirectionStatus.BOTTOM;
            }
        } else if (touchPoint.x >= (midX + 22)) {
            if (touchPoint.y < (midY - 22)) {
                nextStatus = DirectionStatus.RIGHT_TOP;
            } else if (touchPoint.y >= (midY - 22) && touchPoint.y < (midY + 22)) {
                nextStatus = DirectionStatus.RIGHT;
            } else if (touchPoint.y >= (midY + 22)) {
                nextStatus = DirectionStatus.RIGHT_BOTTOM;
            }
        }
        if (this.state.currentStatus !== nextStatus) {
            this.changeControllerDirection(nextStatus);
        }
    };

    changeControllerDirection(direction: number) {
        const keys = RetriveButtonKeysByStatus(this.state.currentStatus);
        const newKeys = RetriveButtonKeysByStatus(direction);

        keys.forEach(k => {
            if (newKeys.indexOf(k) < 0) {
                this.props.onkeyUp(k);
            }
        });

        newKeys.forEach(k => {
            if (keys.indexOf(k) < 0) {
                this.props.onKeyDown(k);
            }
        });

        this.setState({
            currentStatus: direction
        })
    };

    componentDidMount() {
        const container = document.getElementById('arrow-controls');
        container?.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
        container?.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
        container?.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
    }

    componentWillUnmount() {
        const container = document.getElementById('arrow-controls');
        container?.removeEventListener('touchstart', this.handleTouchStart, false);
        container?.removeEventListener('touchmove', this.handleTouchMove, false);
        container?.removeEventListener('touchend', this.handleTouchEnd, false);
    }

    render() {
        return (
            <div id="left-controller">
                <div className="option-controls">
                    <div id="control-select" className="gamepad" onClick={
                        e => {
                            this.props.onKeyDown(ControllerKeys.BUTTON_SELECT);
                            setTimeout(() => {
                                this.props.onkeyUp(ControllerKeys.BUTTON_SELECT);
                            }, 50);
                            e.preventDefault();
                        }
                    }></div>
                </div>
                <div className="arrow-controls" id="arrow-controls" ref={this.stick}>
                    <div className="arrow-top">
                        {/* top */}
                        <div id="control-top" className="gamepad"></div>
                    </div>
                    <div className="arrow-left-right">
                        {/* left */}
                        <div id="control-left" className="gamepad"></div>
                        {/* right */}
                        <div id="control-right" className="gamepad"></div>
                    </div>
                    <div className="arrow-down">
                        {/* down */}
                        <div id="control-down" className="gamepad"></div>
                    </div>
                </div>
                <div className="option-controls">
                </div>
            </div>
        );
    }
}

export class RightController extends React.Component<ControllerProps, any> {

    buttonA: any;
    buttonB: any;
    buttonC: any;
    constructor(props: ControllerProps) {
        super(props);
        this.buttonA = React.createRef();
        this.buttonB = React.createRef();
        this.buttonC = React.createRef();
        this.state = {
            currentStatus: 0
        };
    }

    handleTouchStart(ev: TouchEvent) {
        const touch = ev.targetTouches[0];
        // const rect = (this.stick.current as any).getBoundingClientRect();
        this.dispatchTouchEvent({ x: touch.pageX, y: touch.pageY });
        ev.preventDefault();
    };

    handleTouchMove(ev: TouchEvent) {
        const touch = ev.targetTouches[0];
        this.dispatchTouchEvent({ x: touch.pageX, y: touch.pageY });
        ev.preventDefault();
    };

    handleTouchEnd(ev: TouchEvent) {
        // const touch = ev.changedTouches[0];
        // this.dispatchTouchEvent({ x: touch.pageX, y: touch.pageY });
        if (this.state.currentStatus > 0) {
            const ks = this.keysForStatus(this.state.currentStatus);
            ks.forEach(k => this.props.onkeyUp(k));
            this.setState({
                currentStatus: 0
            })
        }
        ev.preventDefault();
    };

    rectContainsPoint(rect: DOMRect, point: {x: number, y: number}) {
        return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
    }

    dispatchTouchEvent(point: {x: number, y: number}) {
        if (!this.buttonA.current || !this.buttonB.current || !this.buttonC.current) return;
        const rectA = this.buttonA.current.getBoundingClientRect() as DOMRect;
        const rectB = this.buttonB.current.getBoundingClientRect() as DOMRect;
        const rectC = this.buttonC.current.getBoundingClientRect() as DOMRect;
        let key: any[] = [];
        let nextStatus = 0;
        if (this.rectContainsPoint(rectA, point)) {
            key = [ControllerKeys.BUTTON_A];
            nextStatus = 1;
        } else if (this.rectContainsPoint(rectB, point)) {
            key = [ControllerKeys.BUTTON_B];
            nextStatus = 2;
        } else if (this.rectContainsPoint(rectC, point)) {
            key = [ControllerKeys.BUTTON_A, ControllerKeys.BUTTON_B];
            nextStatus = 3;
        }
        if (nextStatus !== this.state.currentStatus) {
            const ks = this.keysForStatus(nextStatus);
            ks.forEach(k => this.props.onKeyDown(k));
            this.setState({
                currentStatus: nextStatus
            });
        }
    }

    keysForStatus(s: number) {
        switch(s) {
            case 1: return [ControllerKeys.BUTTON_A];
            case 2: return [ControllerKeys.BUTTON_B];
            case 3: return [ControllerKeys.BUTTON_A, ControllerKeys.BUTTON_B]
        }
        return [];
    }

    componentDidMount() {
        const container = document.getElementById('action-controls');
        container?.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
        container?.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
        container?.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
    }

    componentWillUnmount() {
        const container = document.getElementById('action-controls');
        container?.removeEventListener('touchstart', this.handleTouchStart, false);
        container?.removeEventListener('touchmove', this.handleTouchMove, false);
        container?.removeEventListener('touchend', this.handleTouchEnd, false);
    }

    render() {
        return (
            <div id="right-controller">
                <div className="option-controls" style={{justifyContent: 'flex-start'}}>
                    <div id="control-start" className="gamepad" onClick={e => {
                        this.props.onKeyDown(ControllerKeys.BUTTON_START);
                        setTimeout(() => {
                            this.props.onkeyUp(ControllerKeys.BUTTON_START);
                        }, 50);
                        e.preventDefault();
                    }}></div>
                </div>
                <div className="arrow-controls" id="action-controls" style={{justifyContent: 'space-around'}}>
                    <div className="arrow-top">
                        <div id="control-ab" className="gamepad" ref={this.buttonC}
                        // onClick={e => {
                        //     this.props.onKeyDown(ControllerKeys.BUTTON_A);
                        //     this.props.onKeyDown(ControllerKeys.BUTTON_B);
                        //     setTimeout(() => {
                        //         this.props.onkeyUp(ControllerKeys.BUTTON_A);
                        //         this.props.onkeyUp(ControllerKeys.BUTTON_B);
                        //     }, 50);
                        //     e.preventDefault();
                        // }}
                        ></div>
                    </div>
                    <div className="arrow-top" style={{justifyContent: 'space-around'}}>
                    <div id="control-b" className="gamepad"  ref={this.buttonB}
                    // onClick={e => {
                    //     this.props.onKeyDown(ControllerKeys.BUTTON_B);
                    //     setTimeout(() => {
                    //         this.props.onkeyUp(ControllerKeys.BUTTON_B);
                    //     }, 50);
                    //     e.preventDefault();
                    // }}
                    ></div>
                    <div id="control-a" className="gamepad" ref={this.buttonA}
                    // onClick={e => {
                    //     this.props.onKeyDown(ControllerKeys.BUTTON_A);
                    //     setTimeout(() => {
                    //         this.props.onkeyUp(ControllerKeys.BUTTON_A);
                    //     }, 50);
                    //     e.preventDefault();
                    // }}
                    ></div>
                    </div>
                </div>
                <div className="option-controls"></div>
            </div>
        );
    }
}