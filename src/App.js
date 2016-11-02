import React, { Component } from 'react';
import './App.css';

import Construct, { Sprite, bullet } from 'react-construct'

class App extends Component {
  render() {
    return (
      <Construct>
        <Sprite 
          behaviours={[ bullet ]}
          paint={{ backgroundColor: 'red', width: '10px', height: '10px' }}
        />
      </Construct>
    );
  }
}

export default App;
