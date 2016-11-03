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
          transform: 'translate(' + this.state.x + 'px,' + this.state.y + 'px)'
        }}
      />
    )
  }
}

export function bullet ({ speed, angle }) {
  return {
    update(state, dt) {
      const x = state.x + (speed * cos(angle)) * dt
      const y = state.y + (speed * sin(angle)) * dt
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
