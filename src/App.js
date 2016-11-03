import React, { Component } from 'react';
import './App.css';

import Construct, { Sprite, bullet, boundToWindow } from './react-construct'

class App extends Component {
  constructor() {
    super()
    this.state = {
      keysDown: [],
      playerAngle: 0
    }
  }
  componentDidMount() {
    document.addEventListener('keydown', (event) => {
      if (this.state.keysDown.indexOf(event.key) !== -1) { return }
      this.setState({ keysDown: [...this.state.keysDown, event.key ] })
      this.setAngle()
    })
    document.addEventListener('keyup', (event) => {
      const removeAtIndex = this.state.keysDown.indexOf(event.key)
      this.setState({ keysDown: this.state.keysDown.filter((key, i) => removeAtIndex !== i) })
      this.setAngle()
    })
  }
  isPressed(key) {
    return this.state.keysDown.indexOf(key) !== -1
  }
  setAngle() {
    if (this.isPressed('w')) {
      this.setState({ playerAngle: 270 })
    }
    if (this.isPressed('a')) {
      this.setState({ playerAngle: 180 })
    }
    if (this.isPressed('s')) {
      this.setState({ playerAngle: 90 })
    }
    if (this.isPressed('d')) {
      this.setState({ playerAngle: 0 })
    }
  }
  render() {
    return (
      <Construct>
        <Sprite
          initial={{
            x: 100,
            y: 100,
            width: 20,
            height: 10
          }}
          behaviours={[
            bullet({
              speed: 200,
              motionAngle: this.state.playerAngle,
              setAngle: true
            }),
            boundToWindow()
          ]}
          paint={{
            backgroundColor: 'red'
          }}
        />
      </Construct>
    );
  }
}

export default App;
