import React, { Component } from 'react'

export default class Construct extends Component {
  render() {
    return (
      <div id="react-construct">
        {this.props.children}
      </div>
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
      opacity: this.props.initial.opacity || 1,
      angle: 0,
      anchor: this.props.initial.anchor || [0.5, 0.5],
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
  render() {
    return (
      <div
        style={{
          ...this.props.style,
          position: 'absolute',
          top: 0,
          left: 0,
          width: this.state.width + 'px',
          height: this.state.height + 'px',
          transform: 'translate(' + (this.state.x - this.state.width*this.state.anchor[0]) + 'px,'  +
                                    (this.state.y - this.state.height*this.state.anchor[1]) + 'px) ' +
                     'rotate(' + this.state.angle + 'deg) ',
          transformOrigin: this.state.anchor[0] + ' ' + this.state.anchor[1],
          opacity: this.state.opacity
        }}
      />
    )
  }
}

export class KeyDown extends Component {
  componentDidMount() {
    document.addEventListener('keydown', (event) => {
      if (event.key === this.props.when) {
        this.props.do()
      }
    })
  }
  shouldComponentUpdate() {
    return false
  }
  render() {
    return null
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

export function rotate ({ speed }) {
  return {
    update(state, dt) {
      const angle = state.angle + (speed * dt)
      const nextState = { ...state, angle }
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

export function fade ({ delay, enter, stay, leave, loop}) {
  delay = delay || 0
  enter = enter || 0
  stay = stay || 0
  leave = leave || 0
  return {
    update(state, dt) {

      const timeSpent = (state.timeSpent || 0) + dt

      const fadeState =
        (delay ? (timeSpent <= delay) : false) ? 'delay' :
        (enter ? (timeSpent <= delay + enter) : false) ? 'enter' :
        (stay ? (timeSpent <= delay + enter + stay) : false) ? 'stay' :
        (leave ? (timeSpent <= delay + enter + stay + leave) : false) ? 'leave' : 'end'

      const opacity =
        (fadeState === 'delay') ? 0 :
        (fadeState === 'enter') ?
          lerp(
            0,
            1,
            (timeSpent - delay) / enter
          ) :
        (fadeState === 'stay') ? 1 :
        (fadeState === 'leave') ?
          lerp(
            1,
            0,
            (timeSpent - (delay + enter + stay)) / leave
          ) :
        (fadeState === 'end') ? state.opacity : 0

      const nextState = {
        ...state,
        timeSpent: (fadeState === 'end' && loop) ? 0 : timeSpent,
        opacity
      }

      return nextState
    }
  }
}

function lerp (start, end, proporcao) {
  return start + (proporcao * (end - start))
}

function sin (angle) {
  return Math.sin(Math.PI * (angle/180))
}

function cos (angle) {
  return Math.cos(Math.PI * (angle/180))
}
