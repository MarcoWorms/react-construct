import React, { Component } from 'react'





export default class Construct extends Component {
  render() {
    return (
      {this.props.children}
    )
  }
}

export class Sprite extends Component {
  constructor() {
    super()
    this.state = {
      x: 0,
      y: 0
    }
  } 
  render() {
    return (
      <div style={this.props.paint}></div>
    )
  }
}


export function bullet {
  update(object, angle, speed, dt) {
    const newObject
    return newObject 
  }
}
