import React, { Component } from 'react'

export default class Construct extends Component {
  render() {
    return (
      this.props.children
    )
  }
}

export class GameObject extends Component {
  constructor(props) {
    super(props)
    this.state = {
      update: this.props.behaviours.map( behaviour =>
        behaviour.update),
      x: this.props.initial.x || 0,
      y: this.props.initial.y || 0,
      width: this.props.initial.width || 0,
      height: this.props.initial.height || 0,
      angle: 0,
      lastFrame: performance.now()
    }
  }
  handleUpdate() {
    const now = performance.now()
    const dt = (now - this.state.lastFrame) / 1000

    const finalState = this.state.update.reduce((nextState, update) => {
      return update(nextState, dt)
    }, this.state)

    this.setState({
      ...finalState,
      lastFrame: now,
      update: this.props.behaviours.map( behaviour =>
        behaviour.update)
    })

    window.requestAnimationFrame(this.handleUpdate.bind(this))
  }
  componentDidMount() {
    this.handleUpdate()
  }
}

export class Sprite extends GameObject {
  render() {
    return (
      <div
        style={{
          ...this.props.paint,
          width: this.state.width + 'px',
          height: this.state.height + 'px',
          transform: 'translate(' + (this.state.x - this.state.width/2) + 'px,'  +
                                    (this.state.y - this.state.height/2) + 'px) ' +
                     'rotate(' + this.state.angle + 'deg)'
        }}
      />
    )
  }
}

export function bullet ({ speed, motionAngle, setAngle }) {
  return {
    update(state, dt) {
      const x = state.x + (speed * cos(motionAngle)) * dt
      const y = state.y + (speed * sin(motionAngle)) * dt
      const angle = setAngle ? motionAngle : state.angle

      const nextState = { ...state, x, y, angle }
      return nextState
    }
  }
}

export function boundToWindow () {
  return {
    update(state, dt) {
      const width = document.body.getBoundingClientRect().right
      const height = document.body.getBoundingClientRect().bottom
      const x = (state.x < 0)
                ? 0
                : (state.x > width)
                  ? width
                  : state.x

      const y = (state.y < 0)
                ? 0
                : (state.y > height)
                  ? height
                  : state.y

      const nextState = { ...state, x, y }
      return nextState
    }
  }
}

function sin (angle) {
  return Math.sin(Math.PI * (angle/180))
}

function cos (angle) {
  return Math.cos(Math.PI * (angle/180))
}
